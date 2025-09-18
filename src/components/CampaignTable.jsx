// src/components/CampaignTable.jsx
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Box,
  Button,
  Stack,
} from "@mui/material";
import AddCampaignForm from "./AddCampaignForm";

/** Parse date strings from the provided campaign data.
 *  Handles M/D/YYYY or MM/DD/YYYY and ISO YYYY-MM-DD.
 */
function parseCampaignDate(s) {
  if (!s) return null;
  // normalize ISO with dashes
  if (s.includes("-")) {
    const d = new Date(s);
    if (!Number.isNaN(d.getTime())) return d;
  }
  // handle M/D/YYYY or MM/DD/YYYY (slashes)
  if (s.includes("/")) {
    const parts = s.split("/");
    if (parts.length === 3) {
      const m = Number(parts[0]);
      const d = Number(parts[1]);
      const y = Number(parts[2]);
      if (!Number.isNaN(m) && !Number.isNaN(d) && !Number.isNaN(y)) {
        return new Date(y, m - 1, d);
      }
    }
  }
  // fallback
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return d;
  return null;
}

export default function CampaignTable() {
  const { data: campaigns, users, search, dateRange } = useSelector((s) => s.campaigns);
  const now = new Date();
  const [openAdd, setOpenAdd] = useState(false);

  const filtered = useMemo(() => {
    return campaigns.filter((c) => {
      // search filter (case-insensitive)
      if (search && !c.name?.toLowerCase().includes(search.toLowerCase())) return false;

      const s = parseCampaignDate(c.startDate);
      const e = parseCampaignDate(c.endDate);

      if (!s && !e) return true;

      const startBoundary = dateRange.start;
      const endBoundary = dateRange.end;

      if (startBoundary && endBoundary) {
        const inStartRange = s && s >= startBoundary && s <= endBoundary;
        const inEndRange = e && e >= startBoundary && e <= endBoundary;
        return inStartRange || inEndRange;
      }

      if (startBoundary && !endBoundary) {
        const inStart = s && s >= startBoundary;
        const inEnd = e && e >= startBoundary;
        return inStart || inEnd;
      }

      if (!startBoundary && endBoundary) {
        const inStart = s && s <= endBoundary;
        const inEnd = e && e <= endBoundary;
        return inStart || inEnd;
      }

      return true;
    });
  }, [campaigns, search, dateRange]);

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
        <Typography variant="h6">Campaigns</Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={() => setOpenAdd(true)}>Add Campaign</Button>
        </Stack>
      </Box>

      {filtered.length === 0 ? (
        <Typography sx={{ mt: 2 }} color="text.secondary">
          No campaigns match the current filters.
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Budget (USD)</TableCell>
                <TableCell>User</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.map((row) => {
                const s = parseCampaignDate(row.startDate);
                const e = parseCampaignDate(row.endDate);
                const active = s && e && now >= s && now <= e;

                const displayName = row.name ?? "<no name>";
                const displayBudget = (row.Budget ?? row.budget) != null ? "$" + ((row.Budget ?? row.budget).toLocaleString()) : "<no budget>";

                return (
                  <TableRow key={row.id}>
                    <TableCell>{displayName}</TableCell>
                    <TableCell>{s ? s.toLocaleDateString() : "—"}</TableCell>
                    <TableCell>{e ? e.toLocaleDateString() : "—"}</TableCell>
                    <TableCell>
                      <Chip label={active ? "Active" : "Inactive"} sx={{ backgroundColor: active ? "#e8f5e9" : "#ffebee", color: active ? "#256029" : "#7f1d1d" }} />
                    </TableCell>
                    <TableCell>{displayBudget}</TableCell>
                    <TableCell>{users[row.userId] || "Unknown user"}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* modal */}
      <AddCampaignForm open={openAdd} onClose={() => setOpenAdd(false)} />
    </>
  );
}
