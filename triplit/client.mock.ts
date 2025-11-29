// Mock Triplit client for Storybook
let mockSubscribeCallback: ((data: any[]) => void) | null = null;
let mockData: any[] = [];
let currentQuery: any = null;

// Helper to filter data based on query conditions
function filterData(data: any[], whereConditions?: any[][]) {
  if (!whereConditions || whereConditions.length === 0) {
    return data;
  }

  return data.filter((item) => {
    return whereConditions.every(([field, operator, value]) => {
      if (operator === "=") {
        return item[field] === value;
      } else if (operator === "<=") {
        return item[field] <= value;
      } else if (operator === ">=") {
        return item[field] >= value;
      } else if (operator === "<") {
        return item[field] < value;
      } else if (operator === ">") {
        return item[field] > value;
      }
      return true;
    });
  });
}

export const triplit = {
  query: (collection: string) => {
    const queryObj = {
      collection,
      whereConditions: null as any[][] | null,
      Where: function (conditions: any[][]) {
        this.whereConditions = conditions;
        return this;
      },
    };
    currentQuery = queryObj;
    return queryObj;
  },
  subscribe: (query: any, callback: (data: any[]) => void) => {
    mockSubscribeCallback = callback;
    // Filter and immediately call with current mock data
    const filteredData = filterData(mockData, query.whereConditions);
    callback(filteredData);
    // Return unsubscribe function
    return () => {
      mockSubscribeCallback = null;
    };
  },
  update: async (collection: string, id: string, data: any) => {
    // Mock update - just return success
    console.log("Mock triplit.update", collection, id, data);
    return { id, ...data };
  },
  insert: async (collection: string, data: any) => {
    // Mock insert - return with generated id
    const id = "mock-" + Math.random().toString(36).substr(2, 9);
    console.log("Mock triplit.insert", collection, id, data);
    return { id, ...data };
  },
  delete: async (collection: string, id: string) => {
    // Mock delete - return success
    console.log("Mock triplit.delete", collection, id);
    return { id };
  },
  onConnectionStatusChange: () => {},
  // Helper method to set mock data from stories
  __setMockData: (data: any[]) => {
    mockData = data;
    if (mockSubscribeCallback && currentQuery) {
      const filteredData = filterData(data, currentQuery.whereConditions);
      mockSubscribeCallback(filteredData);
    } else if (mockSubscribeCallback) {
      mockSubscribeCallback(data);
    }
  },
};
