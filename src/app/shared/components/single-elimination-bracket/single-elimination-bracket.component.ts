import { Component, Input, OnInit } from '@angular/core';
import { MatchService } from '../../../core/http-services/match.service';

interface Match {
  id: string;
  participant1Id: number;
  participant2Id: number;
  participant1Name: string;
  participant2Name: string;
  winnerId: number | null;
  round: number;
  matchNumber: number;
}

@Component({
  selector: 'app-single-elimination-bracket',
  templateUrl: './single-elimination-bracket.component.html',
  styleUrls: ['./single-elimination-bracket.component.scss']
})
export class SingleEliminationBracketComponent implements OnInit {
  @Input() bracketKey: string = '';
  @Input() hasAnyBrackets: boolean = false;

  matches: Match[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private matchService: MatchService) { }

  ngOnInit() {
    if (this.hasAnyBrackets) {
      this.loadMatches();
    }
  }

  getRounds(): number[] {
    if (!this.matches.length) return [];
    const maxRound = Math.max(...this.matches.map(m => m.round));
    return Array.from({ length: maxRound }, (_, i) => i + 1);
  }

  getMatchesForRound(roundIndex: number): Match[] {
    return this.matches.filter(match => match.round === roundIndex + 1)
      .sort((a, b) => a.matchNumber - b.matchNumber);
  }

  private loadMatches() {
    console.log(this.bracketKey);
    this.loading = true;
    this.error = null;


    this.matchService.getBracketMatches(this.bracketKey).subscribe({
      next: (response) => {
        this.matches = this.processMatches(response.data);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load matches';
        this.loading = false;
      }
    });
  }

  private processMatches(matches: any[]): Match[] {
    // Process and structure the matches data
    return matches.map((match, index) => ({
      id: match.id,
      participant1Id: match.participant1Id,
      participant2Id: match.participant2Id,
      participant1Name: match.participant1Name || 'TBD',
      participant2Name: match.participant2Name || 'TBD',
      winnerId: match.winnerId,
      round: this.calculateRound(index + 1, matches.length),
      matchNumber: index + 1
    }));
  }

  private calculateRound(matchNumber: number, totalMatches: number): number {
    // Calculate which round a match belongs to in a single elimination tournament
    let round = 1;
    let matchesInRound = totalMatches;

    while (matchesInRound > 1) {
      if (matchNumber <= matchesInRound) {
        return round;
      }
      matchNumber -= matchesInRound;
      matchesInRound = Math.floor(matchesInRound / 2);
      round++;
    }

    return round;
  }
}
