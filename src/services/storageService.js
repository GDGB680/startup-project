// storageService.js - Manages all localStorage operations

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

  // Initialize with mock data
  static initializeMockData() {
    if (!this.getBounties().length) {
      const mockBounties = [
        {
          id: 1,
          title: 'Epic Orchestra',
          genres: ['Orchestra', 'Cinematic'],
          bountyPrize: 50,
          duration: '45s',
          deadline: '2025-10-29',
          details: 'For short film trailer',
          postedBy: 'FilmMaker123',
          postedDate: new Date().toISOString(),
          submissions: []
        },
        {
          id: 2,
          title: 'Inspirational Techno Pop',
          genres: ['Techno', 'Pop'],
          bountyPrize: 30,
          duration: '30s',
          deadline: '2025-10-25',
          details: 'For YouTube ad',
          postedBy: 'MarketingPro',
          postedDate: new Date().toISOString(),
          submissions: []
        }
      ];
      localStorage.setItem('bounties', JSON.stringify(mockBounties));
    }
  }
}
