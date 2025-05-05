import { Component, Input, OnInit } from '@angular/core';
import { MatchService } from '../../../core/http-services/match.service';

interface Participant {
  id: number | null;
  fullName: string | null;
  coachId: string | null;
  coachFullName: string | null;
  isBye: boolean;
}

interface Match {
  id: string;
  round: number;
  matchNumberPosition: number;
  first: Participant;
  second: Participant;
  winner: Participant;
}

@Component({
  selector: 'app-single-elimination-bracket',
  templateUrl: './single-elimination-bracket.component.html'
})
export class SingleEliminationBracketComponent {
  private _bracketKey: string = '';
  @Input() set bracketKey(value: string) {
    this._bracketKey = value;
      this.loadMatches();
  }
  get bracketKey(): string {
    return this._bracketKey;
  }


  matches: Match[] = [];
  rounds: { [key: number]: Match[] } = {};
  roundOrder: number[] = [128, 64, 32, 16, 8, 4, 2]; // Order from largest to smallest
  loading: boolean = false;
  error: string | null = null;

  constructor(private matchService: MatchService) { }


  private loadMatches() {
    this.loading = true;
    this.error = null;

    this.matchService.getBracketMatches(this.bracketKey).subscribe({
      next: (response) => {
        this.matches = this.processMatches(response.data);
        this.groupMatchesByRound();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load matches';
        this.loading = false;
      }
    });
  }

  private processMatches(matches: any[]): Match[] {
    return matches.map(match => ({
      id: match.id,
      round: match.round,
      matchNumberPosition: match.matchNumberPosition,
      first: {
        id: match.firstParticipantId,
        fullName: match.firstParticipantFullName,
        coachId: match.firstParticipantCoachId,
        coachFullName: match.firstParticipantCoachFullName,
        isBye: match.isFirstParticipantBye
      },
      second: {
        id: match.secondParticipantId,
        fullName: match.secondParticipantFullName,
        coachId: match.secondParticipantCoachId,
        coachFullName: match.secondParticipantCoachFullName,
        isBye: match.isSecondParticipantBye
      },
      winner: {
        id: match.winnerParticipantId,
        fullName: match.winnerParticipantFullName,
        coachId: match.winnerParticipantCoachId,
        coachFullName: match.winnerParticipantCoachFullName,
        isBye: false
      }
    }));
  }

  private groupMatchesByRound() {
    this.rounds = {};
    this.matches.forEach(match => {
      if (!this.rounds[match.round]) {
        this.rounds[match.round] = [];
      }
      this.rounds[match.round].push(match);
    });
  }

  getRounds(): number[] {
    console.log(this.roundOrder.filter(round => this.rounds[round]));
    return this.roundOrder.filter(round => this.rounds[round]);
  }

  getMatchesForRound(round: number): Match[] {
    return this.rounds[round] || [];
  }

  getParticipantDisplay(participant: Participant): string {
    if (participant.isBye) {
      return 'Bye';
    }
    if (!participant.fullName && !participant.coachFullName) {
      return '-';
    }
    return `${participant.fullName} (${participant.coachFullName})`;
  }

  getRoundDisplay(round: number): string {
    switch (round) {
      case 128: return 'Round of 128';
      case 64: return 'Round of 64';
      case 32: return 'Round of 32';
      case 16: return 'Round of 16';
      case 8: return 'Quarter Finals';
      case 4: return 'Semi Finals';
      case 2: return 'Finals';
      default: return `Round ${round}`;
    }
  }
}
