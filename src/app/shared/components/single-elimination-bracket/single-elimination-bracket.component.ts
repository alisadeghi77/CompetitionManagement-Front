import { Component, Input, OnInit } from '@angular/core';
import { MatchService } from '../../../core/http-services/match.service';
import { CommonModule } from '@angular/common';

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
  firstParticipantId: string | null;
  firstParticipantFullName: string | null;
  firstParticipantCoachId: string | null;
  firstParticipantCoachFullName: string | null;
  isFirstParticipantBye: boolean;
  secondParticipantId: string | null;
  secondParticipantFullName: string | null;
  secondParticipantCoachId: string | null;
  secondParticipantCoachFullName: string | null;
  isSecondParticipantBye: boolean;
  winnerParticipantId: string | null;
  winnerParticipantFullName: string | null;
  winnerParticipantCoachId: string | null;
  winnerParticipantCoachFullName: string | null;
}

@Component({
  selector: 'app-single-elimination-bracket',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single-elimination-bracket.component.html',
  styleUrls: ['./single-elimination-bracket.component.scss']
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
      firstParticipantId: match.firstParticipantId,
      firstParticipantFullName: match.firstParticipantFullName,
      firstParticipantCoachId: match.firstParticipantCoachId,
      firstParticipantCoachFullName: match.firstParticipantCoachFullName,
      isFirstParticipantBye: match.isFirstParticipantBye,
      secondParticipantId: match.secondParticipantId,
      secondParticipantFullName: match.secondParticipantFullName,
      secondParticipantCoachId: match.secondParticipantCoachId,
      secondParticipantCoachFullName: match.secondParticipantCoachFullName,
      isSecondParticipantBye: match.isSecondParticipantBye,
      winnerParticipantId: match.winnerParticipantId,
      winnerParticipantFullName: match.winnerParticipantFullName,
      winnerParticipantCoachId: match.winnerParticipantCoachId,
      winnerParticipantCoachFullName: match.winnerParticipantCoachFullName
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
    const rounds = [...new Set(this.matches.map(match => match.round))].sort((a, b) => a - b);
    return rounds;
  }


  getRoundDisplay(round: number): string {
    const roundNames: { [key: number]: string } = {
      128: 'Round of 128',
      64: 'Round of 64',
      32: 'Round of 32',
      16: 'Round of 16',
      8: 'Quarter Final',
      4: 'Semi Final',
      2: 'Final'
    };
    return roundNames[round] || `Round ${round}`;
  }

  getMatchGroupsForRound(round: number): Match[][] {
    const roundMatches = this.matches.filter(match => match.round === round);
    const groups: Match[][] = [];
    for (let i = 0; i < roundMatches.length; i += 2) {
      const group = [roundMatches[i]];
      if (i + 1 < roundMatches.length) {
        group.push(roundMatches[i + 1]);
      }
      groups.push(group);
    }
    console.log('groups',groups.map(group => group.length).join(','));
    return groups;
  }
}
