import campaignsReducer, { addCampaign } from "../src/features/campaignList/campaignsSlice";

describe("campaigns slice reducer", () => {
  it("adds a campaign object", () => {
    const initialState = {
      data: [],
      loading: false,
      error: null,
      search: "",
      users: {},
      dateRange: { start: null, end: null }
    };

    const campaign = {
      id: 999,
      name: "Test Campaign",
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      Budget: 1234,
      userId: 1
    };

    const next = campaignsReducer(initialState, addCampaign(campaign));
    expect(next.data).toHaveLength(1);
    expect(next.data[0]).toMatchObject({
      id: 999,
      name: "Test Campaign",
      Budget: 1234
    });
  });
});
