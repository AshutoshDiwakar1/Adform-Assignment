// src/components/AddCampaignForm.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Grid,
  Button,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { addCampaign } from "../features/campaignList/campaignsSlice"; // adjust path if needed

function validDateString(s) {
  if (!s) return false;
  const d = new Date(s);
  return !Number.isNaN(d.getTime());
}

export default function AddCampaignForm({ open, onClose }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    id: "",
    name: "",
    startDate: "",
    endDate: "",
    Budget: "",
    userId: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      // reset whenever modal closes
      setForm({ id: "", name: "", startDate: "", endDate: "", Budget: "", userId: "" });
      setError("");
    }
  }, [open]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError("");
  }

  function reset() {
    setForm({ id: "", name: "", startDate: "", endDate: "", Budget: "", userId: "" });
    setError("");
  }

  function onSubmit(e) {
    e.preventDefault();
    // basic validation
    if (!form.id || !form.name || !form.startDate || !form.endDate || !form.Budget) {
      setError("Please fill id, name, startDate, endDate and Budget.");
      return;
    }
    if (!validDateString(form.startDate) || !validDateString(form.endDate)) {
      setError("Please use valid dates (YYYY-MM-DD).");
      return;
    }
    const s = new Date(form.startDate);
    const en = new Date(form.endDate);
    if (en < s) {
      setError("End date cannot be before start date.");
      return;
    }

    const campaign = {
      id: Number(form.id),
      name: form.name,
      startDate: form.startDate,
      endDate: form.endDate,
      Budget: Number(form.Budget),
      userId: form.userId ? Number(form.userId) : null,
    };

    // dispatch single object (reducer expects an object)
    dispatch(addCampaign(campaign));

    // close modal after adding
    if (typeof onClose === "function") onClose();
    // reset for next open
    reset();
  }

  return (
    <Dialog open={!!open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add new campaign</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent dividers>
          {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

          <Grid container spacing={1}>
            <Grid item xs={12} sm={4}>
              <TextField label="ID" name="id" value={form.id} onChange={onChange} fullWidth inputProps={{ inputMode: "numeric" }} />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField label="Name" name="name" value={form.name} onChange={onChange} fullWidth />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Start date"
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={onChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="End date"
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={onChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField label="Budget (USD)" name="Budget" value={form.Budget} onChange={onChange} fullWidth inputProps={{ inputMode: "numeric" }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="UserId (optional)" name="userId" value={form.userId} onChange={onChange} fullWidth inputProps={{ inputMode: "numeric" }} />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} variant="outlined">Cancel</Button>
          <Button type="submit" variant="contained">Add</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
