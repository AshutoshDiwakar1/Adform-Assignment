import React, { useEffect, useCallback } from "react";
import { Container, Paper, Typography, Grid, TextField, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import CampaignTable from "../../components/CampaignTable";
import { fetchCampaigns, addCampaign, setSearch, setDateRange } from "./campaignsSlice";
import AddCampaignForm from "../../components/AddCampaignForm";

export default function CampaignList() {
  const dispatch = useDispatch();
  const { search, dateRange, loadingUsers, errorUsers } = useSelector((s) => s.campaigns);

  // fetch users once
  useEffect(() => {
    dispatch(fetchCampaigns());
  }, [dispatch]);

  // expose AddCampaigns globally for testing as required
  useEffect(() => {
    const fn = (payload) => {
      try {
        if (!payload) return false;
        const items = Array.isArray(payload) ? payload : [payload];
        items.forEach(item => {
          if (item && typeof item === "object" && !Array.isArray(item)) {
            const normalized = {
              id: Number(item.id),
              name: item.name ?? item.title ?? "",
              startDate: item.startDate ?? item.start ?? "",
              endDate: item.endDate ?? item.end ?? "",
              Budget: item.Budget != null ? Number(item.Budget) : (item.budget != null ? Number(item.budget) : 0),
              userId: item.userId != null ? Number(item.userId) : (item.userId === null ? null : undefined)
            };
            dispatch(addCampaign(normalized));
          }
        });
        return true;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("AddCampaigns error:", e);
        return false;
      }
    };
  
    // attach
    window.AddCampaigns = fn;
  
    return () => {
      try { delete window.AddCampaigns; } catch (e) {}
    };
  }, [dispatch]);

  const onSearch = useCallback((e) => dispatch(setSearch(e.target.value)), [dispatch]);

  // handlers for date inputs
  const onStartDate = (e) => {
    const start = e.target.value ? new Date(e.target.value) : null;
    const end = dateRange.end;
    // if end exists and start > end, ignore (prevent invalid)
    if (start && end && start > end) return;
    dispatch(setDateRange({ start, end }));
  };

  const onEndDate = (e) => {
    const end = e.target.value ? new Date(e.target.value) : null;
    const start = dateRange.start;
    if (start && end && end < start) return;
    dispatch(setDateRange({ start, end }));
  };

  return (
    <Container sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }} elevation={4}>
        <Typography variant="h4" gutterBottom>
          Adform — Campaigns
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search by campaign name"
                value={search}
                onChange={onSearch}
                inputProps={{ "aria-label": "Search by campaign name" }}
              />
            </Grid>

            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                type="date"
                label="Start date"
                InputLabelProps={{ shrink: true }}
                onChange={onStartDate}
                value={dateRange.start ? dateRange.start.toISOString().slice(0, 10) : ""}
              />
            </Grid>

            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                type="date"
                label="End date"
                InputLabelProps={{ shrink: true }}
                onChange={onEndDate}
                value={dateRange.end ? dateRange.end.toISOString().slice(0, 10) : ""}
              />
            </Grid>
          </Grid>
        </Box>

        <AddCampaignForm />

        <Box sx={{ mb: 2 }}>
          {loadingUsers ? (
            <Typography>Loading users...</Typography>
          ) : errorUsers ? (
            <Typography color="error">{errorUsers}</Typography>
          ) :  <CampaignTable />}
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Tip: open the browser console and run <code>window.AddCampaigns([...])</code> to append campaigns.
        </Typography>
      </Paper>
    </Container>
  );
}