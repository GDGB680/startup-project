// storageService.js - Manages all localStorage operations

const mockBountyTitles = [
  'Epic Cinema Orchestral Suite',
  'Upbeat Techno Pop Remix',
  'Chill Lo-Fi Gaming Background',
  'Dynamic Action Thriller Music',
  'Ambient Meditation Track',
  'Funky Disco Dance Beats',
];

export class StorageService {
  // User Management
  static getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser')) || null;
  }

  static setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  static logout() {
    localStorage.removeItem('currentUser');
  }

  // Bounties Management
  static getBounties() {
    return JSON.parse(localStorage.getItem('bounties')) || [];
  }

  static addBounty(bounty) {
    const bounties = this.getBounties();
    const newBounty = {
      id: Date.now(),
      ...bounty,
      postedBy: this.getCurrentUser()?.username || 'Anonymous',
      postedDate: new Date().toISOString(),
      submissions: []
    };
    bounties.push(newBounty);
    localStorage.setItem('bounties', JSON.stringify(bounties));
    return newBounty;
  }

  static updateBounty(id, updates) {
    const bounties = this.getBounties();
    const index = bounties.findIndex(b => b.id === id);
    if (index !== -1) {
      bounties[index] = { ...bounties[index], ...updates };
      localStorage.setItem('bounties', JSON.stringify(bounties));
    }
  }

  static deleteBounty(id) {
    const bounties = this.getBounties();
    const filtered = bounties.filter(b => b.id !== id);
    localStorage.setItem('bounties', JSON.stringify(filtered));
  }

  // Submissions Management
  static getSubmissions() {
    return JSON.parse(localStorage.getItem('submissions')) || [];
  }

  static addSubmission(submission) {
    const submissions = this.getSubmissions();
    const newSubmission = {
      id: Date.now(),
      ...submission,
      submittedBy: this.getCurrentUser()?.username || 'Anonymous',
      submittedDate: new Date().toISOString(),
      status: 'Pending'
    };
    submissions.push(newSubmission);
    localStorage.setItem('submissions', JSON.stringify(submissions));
    return newSubmission;
  }

  static updateSubmissionStatus(id, status) {
    const submissions = this.getSubmissions();
    const index = submissions.findIndex(s => s.id === id);
    if (index !== -1) {
      submissions[index].status = status;
      localStorage.setItem('submissions', JSON.stringify(submissions));
    }
  }

  // Mock data generation
  static generateMockBountyTitle() {
    return mockBountyTitles[Math.floor(Math.random() * mockBountyTitles.length)];
  }

  // Initialize with mock data on first load
  static initializeMockData() {
    if (!this.getBounties().length) {
      const mockBounties = [
        {
          id: 1,
          title: 'Epic Orchestra for Film Trailer',
          genres: ['Orchestra', 'Cinematic'],
          bountyPrize: 50,
          duration: '45s',
          deadline: '2025-10-29',
          details: 'Need dramatic orchestral music for short film trailer. Must convey emotion and action.',
          postedBy: 'FilmMaker123',
          postedDate: new Date(Date.now() - 86400000).toISOString(),
          submissions: []
        },
        {
          id: 2,
          title: 'Upbeat Techno Pop for YouTube Ad',
          genres: ['Techno', 'Pop'],
          bountyPrize: 30,
          duration: '30s',
          deadline: '2025-10-25',
          details: 'Looking for energetic, modern techno-pop track for product ad campaign.',
          postedBy: 'MarketingPro',
          postedDate: new Date(Date.now() - 172800000).toISOString(),
          submissions: []
        },
        {
          id: 3,
          title: 'Chill Lo-Fi Gaming Background',
          genres: ['Lo-fi', 'Chill'],
          bountyPrize: 25,
          duration: '2min',
          deadline: '2025-10-30',
          details: 'Relaxing lo-fi beats for indie game. Should be calming and loopable.',
          postedBy: 'GameDev88',
          postedDate: new Date(Date.now() - 259200000).toISOString(),
          submissions: []
        }
      ];
      localStorage.setItem('bounties', JSON.stringify(mockBounties));
    }

    // Initialize mock submissions
    if (!this.getSubmissions().length) {
      const mockSubmissions = [
        {
          id: 101,
          bountyId: 1,
          bountyTitle: 'Epic Orchestra for Film Trailer',
          songTitle: 'Cinematic Dreams',
          submittedBy: 'ComposerX',
          submittedDate: new Date(Date.now() - 432000000).toISOString(),
          status: 'Winner'
        },
        {
          id: 102,
          bountyId: 2,
          bountyTitle: 'Upbeat Techno Pop for YouTube Ad',
          songTitle: 'Electric Pulse',
          submittedBy: 'BeatMaker420',
          submittedDate: new Date(Date.now() - 345600000).toISOString(),
          status: 'Pending'
        }
      ];
      localStorage.setItem('submissions', JSON.stringify(mockSubmissions));
    }
  }
}
