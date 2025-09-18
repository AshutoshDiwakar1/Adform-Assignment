import React, { useMemo } from "react";
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
} from "@mui/material";


function parseCampaignDate(s) {
  if (!s) return null;
  if (s.includes("-")) {
    const d = new Date(s);
    if (!Number.isNaN(d.getTime())) return d;
  }

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
  const { data: campaigns, search, dateRange, users } = useSelector(
    (s) => s.campaigns
  );

  console.log(users);
  const now = new Date();

  const filtered = useMemo(() => {
    return campaigns.filter((c) => {
      // search filter (case-insensitive)
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()))
        return false;

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
        // show if start or end is >= startBoundary
        const inStart = s && s >= startBoundary;
        const inEnd = e && e >= startBoundary;
        return inStart || inEnd;
      }

      if (!startBoundary && endBoundary) {
        // show if start or end is <= endBoundary
        const inStart = s && s <= endBoundary;
        const inEnd = e && e <= endBoundary;
        return inStart || inEnd;
      }

      // no boundaries — include
      return true;
    });
  }, [campaigns, search, dateRange]);

  if (!filtered.length) {
    return (
      <Typography sx={{ mt: 2 }} color="text.secondary">
        No campaigns match the current filters.
      </Typography>
    );
  }

  return (
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

            return (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{s ? s.toLocaleDateString() : "—"}</TableCell>
                <TableCell>{e ? e.toLocaleDateString() : "—"}</TableCell>
                <TableCell>
                  <Chip
                    label={active ? "Active" : "Inactive"}
                    sx={{
                      backgroundColor: active ? "#e8f5e9" : "#ffebee",
                      color: active ? "#256029" : "#7f1d1d",
                    }}
                  />
                </TableCell>
                <TableCell>
                  {"$" + (row.Budget ? row.Budget.toLocaleString() : "0")}
                </TableCell>
                <TableCell>{users[row.userId] || "Unknown user"}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
