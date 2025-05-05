import { Component, Input } from '@angular/core';
import { MatchService } from '../../../core/http-services/match.service';
import { CommonModule } from '@angular/common';
import { NgZone } from '@angular/core';

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
export class SingleEliminationBracketComponent  {
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

  onParticipantClick(match: Match, isFirstParticipant: boolean) {
    const participantId = isFirstParticipant ? match.firstParticipantId : match.secondParticipantId;

    // Don't proceed if participant is null or it's a bye match
    if (!participantId ||
        (isFirstParticipant && match.isFirstParticipantBye) ||
        (!isFirstParticipant && match.isSecondParticipantBye)) {
      return;
    }

    this.loading = true;
    this.matchService.setMatchWinner({
      matchId: match.id,
      participantId: Number(participantId)
    }).subscribe({
      next: () => {
        // Reload matches after setting winner
        this.loadMatches();
      },
      error: (err) => {
        this.error = 'Failed to set match winner';
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

    // Sort matches in each round by matchNumberPosition in descending order
    Object.keys(this.rounds).forEach(round => {
      this.rounds[Number(round)].sort((a, b) => b.matchNumberPosition - a.matchNumberPosition);
    });
  }

  getRounds(): number[] {
    return this.roundOrder.filter(round => this.rounds[round]?.length > 0)
    .sort((a, b) => a - b);;
  }

  getRoundDisplay(round: number): string {
    const roundNames: { [key: number]: string } = {
      128: 'دور ۱۲۸',
      64: 'دور ۶۴',
      32: 'دور ۳۲',
      16: 'دور ۱۶',
      8: 'یک چهارم نهایی',
      4: 'نیمه نهایی',
      2: 'فینال'
    };
    return roundNames[round] || `Round ${round}`;
  }

  getMatchGroupsForRound(round: number): Match[][] {
    const roundMatches = this.rounds[round] || [];
    const groups: Match[][] = [];

    for (let i = 0; i < roundMatches.length; i += 2) {
      const group = [roundMatches[i]];
      if (i + 1 < roundMatches.length) {
        group.push(roundMatches[i + 1]);
      }
      groups.push(group);
    }

    return groups;
  }
}
