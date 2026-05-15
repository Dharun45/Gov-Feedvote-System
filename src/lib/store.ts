/**
 * store.ts — LEGACY COMPATIBILITY SHIM
 *
 * All real data is now served from the Node.js backend + MongoDB.
 * This file is kept only to prevent import errors in pages not yet
 * migrated to the real API. It returns empty arrays/null and performs
 * no localStorage operations.
 *
 * Migrate pages to use src/lib/api.ts instead.
 */

export const store = {
  getBuildings: () => [],
  getEmployees: () => [],
  getEmployee: (_id: string) => null,
  getFeedback: () => [],
  getCurrentUser: () => null,
  registerUser: (_name: string, _email: string, _phone?: string) => ({ id: '', name: _name, email: _email }),
  loginAdmin: (_email: string, _password: string) => null,
  logoutAdmin: () => {},
  submitFeedback: (_data: any) => {},
  canUserVote: (_userId: string) => true,
  analyzeSentiment: (_text: string) => ({ sentiment: 'Neutral', score: 0.5 }),
  updateFeedbackStatus: (_id: string, _status: string) => {},
  addBuilding: (_data: any) => {},
  deleteBuilding: (_id: string) => {},
  addEmployee: (_data: any) => {},
  deleteEmployee: (_id: string) => {},
  assignBuildingAdmin: (_buildingId: string, _email: string) => {},
};
