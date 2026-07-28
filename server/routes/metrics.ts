// server/routes/metrics.ts
import { Router } from 'express';
import { MetricsService } from "../services/metrics.service";
import type { CreateMetricDto } from "../services/metrics.service";

const router = Router();
const metricsService = new MetricsService();

// POST - Create new metric
router.post('/', async (req, res) => {
  try {
    const metricData: CreateMetricDto = {
      clientId: req.body.clientId,
      sprintNumber: Number(req.body.sprintNumber),
      codeQuality: Number(req.body.codeQuality),
      velocity: Number(req.body.velocity),
      iterationQuality: Number(req.body.iterationQuality),
      communication: Number(req.body.communication),
      notes: req.body.notes,
      recordedAt: req.body.recordedAt || Date.now(),
      recordedBy: req.body.recordedBy,           // Should ideally come from auth
    };

    const result = await metricsService.createMetric(metricData);
    res.status(201).json(result);
  } catch (error: any) {
    console.error('Create Metric Error:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Failed to create metric' 
    });
  }
});

// GET - Get all metrics
router.get('/', async (req, res) => {
  try {
    const metrics = await metricsService.getAllMetrics();
    res.json(metrics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Get metrics by client
router.get('/client/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    const metrics = await metricsService.getMetricsByClient(clientId as any);
    res.json(metrics);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// GET - Get single metric by ID
router.get('/:id', async (req, res) => {
  try {
    const metric = await metricsService.getMetricById(req.params.id as any);
    res.json(metric);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// PATCH - Update metric
router.patch('/:id', async (req, res) => {
  try {
    const result = await metricsService.updateMetric({
      id: req.params.id as any,
      ...req.body,
    });
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Delete metric
router.delete('/:id', async (req, res) => {
  try {
    const result = await metricsService.removeMetric(req.params.id as any);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;