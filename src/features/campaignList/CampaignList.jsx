import React, { useEffect, useCallback, useMemo, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Box,
  IconButton,
  Button,
  Stack,
  Chip,
  CircularProgress,
  Divider,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import CampaignTable from "../../components/CampaignTable";
import {
  fetchCampaigns,
  addCampaign,
  setSearch,
  setDateRange,
} from "./campaignsSlice";
import AddCampaignForm from "../../components/AddCampaignForm";

export default function CampaignList() {
  const dispatch = useDispatch();
  const { data: campaigns, search, dateRange, loadingUsers, users, errorUsers } =
    useSelector((s) => s.campaigns || {});
  const [openAdd, setOpenAdd] = useState(false);

  useEffect(() => {
    dispatch(fetchCampaigns());
  }, [dispatch]);

  useEffect(() => {
    const fn = (payload) => {
      try {
        if (!payload) return false;
        const items = Array.isArray(payload) ? payload : [payload];
        items.forEach((item) => {
          if (item && typeof item === "object" && !Array.isArray(item)) {
            const normalized = {
              id: Number(item.id),
              name: item.name ?? item.title ?? "",
              startDate: item.startDate ?? item.start ?? "",
              endDate: item.endDate ?? item.end ?? "",
              Budget:
                item.Budget != null
                  ? Number(item.Budget)
                  : item.budget != null
                  ? Number(item.budget)
                  : 0,
              userId:
                item.userId != null
                  ? Number(item.userId)
                  : item.userId === null
                  ? null
                  : undefined,
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

    window.AddCampaigns = fn;
    return () => {
      try {
        delete window.AddCampaigns;
      } catch (e) {}
    };
  }, [dispatch]);

  const onSearch = useCallback((e) => dispatch(setSearch(e.target.value)), [
    dispatch,
  ]);

  // handlers for date inputs
  const onStartDate = (e) => {
    const start = e.target.value ? new Date(e.target.value) : null;
    const end = dateRange?.end;
    if (start && end && start > end) return;
    dispatch(setDateRange({ start, end }));
  };

  const onEndDate = (e) => {
    const end = e.target.value ? new Date(e.target.value) : null;
    const start = dateRange?.start;
    if (start && end && end < start) return;
    dispatch(setDateRange({ start, end }));
  };

  // derived stats
  const stats = useMemo(() => {
    const total = campaigns?.length ?? 0;
    const now = new Date();
    const active = (campaigns || []).filter((c) => {
      try {
        const s = c.startDate ? new Date(c.startDate) : null;
        const e = c.endDate ? new Date(c.endDate) : null;
        return s && e && now >= s && now <= e;
      } catch {
        return false;
      }
    }).length;
    const totalBudget = (campaigns || []).reduce(
      (sum, c) => sum + (Number(c.Budget) || 0),
      0
    );
    return { total, active, totalBudget };
  }, [campaigns]);

  return (
    <Container sx={{ py: 4 }}>
      <Paper sx={{ p: { xs: 2, md: 3 }, position: "relative" }} elevation={6}>
        {/* Header / toolbar */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Adform — Campaigns
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Manage campaigns — filter by name or date range. Responsive, accessible,
              and production-ready.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={`Total: ${stats.total}`}
              color="primary"
              variant="outlined"
              size="small"
            />
            <Chip
              label={`Active: ${stats.active}`}
              sx={{
                borderColor: "#c8e6c9",
                color: "#256029",
              }}
              size="small"
            />
            <Chip
              label={`Budget: $${stats.totalBudget.toLocaleString()}`}
              variant="outlined"
              size="small"
            />
          </Stack>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Filters row */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search campaigns by name..."
              label="Search by campaign name"
              value={search || ""}
              onChange={onSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                "aria-label": "search",
              }}
              size="small"
            />
          </Grid>

          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              type="date"
              label="Start date"
              InputLabelProps={{ shrink: true }}
              onChange={onStartDate}
              value={dateRange?.start ? dateRange.start.toISOString().slice(0, 10) : ""}
              size="small"
            />
          </Grid>

          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              type="date"
              label="End date"
              InputLabelProps={{ shrink: true }}
              onChange={onEndDate}
              value={dateRange?.end ? dateRange.end.toISOString().slice(0, 10) : ""}
              size="small"
            />
          </Grid>
        </Grid>

        {/* Loading overlay + table */}
        <Box sx={{ position: "relative" }}>
          {loadingUsers ? (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                zIndex: 5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.7)",
                borderRadius: 1,
              }}
            >
              <CircularProgress />
            </Box>
          ) : null}

          {/* error */}
          {errorUsers ? (
            <Box sx={{ mb: 2 }}>
              <Typography color="error">{errorUsers}</Typography>
            </Box>
          ) : null}

          {/* Campaigns table */}
          <Box sx={{ mt: 1 }}>
            <CampaignTable />
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Tip: open the browser console and run <code>window.AddCampaigns([...])</code> to
          append campaigns.
        </Typography>
      </Paper>

      {/* Modal for adding campaigns */}
      <AddCampaignForm open={openAdd} onClose={() => setOpenAdd(false)} />
    </Container>
  );
}
