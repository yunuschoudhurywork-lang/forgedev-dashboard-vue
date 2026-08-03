import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../convex/_generated/api'; 
import type { Id } from '../../convex/_generated/dataModel'; 

export interface CreateMetricDto {
  clientId: Id<'users'>;
  sprintNumber: number;
  codeQuality: number;
  velocity: number;
  iterationQuality: number;
  communication: number;
  notes: string;
  recordedAt: number;
  recordedBy: Id<'users'>;
}

export interface UpdateMetricDto {
  id: Id<'metrics'>;
  
  codeQuality?: number;
  velocity?: number;
  
}

@Injectable()
export class MetricsService {
  private convex: ConvexHttpClient;

  constructor() {
    if (!process.env.CONVEX_URL) {
      throw new Error('CONVEX_URL environment variable is not set');
    }
    this.convex = new ConvexHttpClient(process.env.CONVEX_URL);
  }

  /**
   * Create a new metric record
   */
  async createMetric(data: CreateMetricDto) {
    try {
      const id = await this.convex.mutation(api.metrics.create, data);
      return { success: true, id, message: 'Metric created successfully' };
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to create metric');
    }
  }

  
  async getAllMetrics() {
    try {
      return await this.convex.query(api.metrics.getAll, {});
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to fetch metrics');
    }
  }

  //Get metrics by client (user)
  async getMetricsByClient(clientId: Id<'users'>) {
    if (!clientId) {
      throw new BadRequestException('clientId is required');
    }

    try {
      return await this.convex.query(api.metrics.getByClient, { clientId });
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to fetch client metrics');
    }
  }

  //Get single metric by ID (bonus helper method)
  async getMetricById(id: Id<'metrics'>) {
    // Note: You may want to add a dedicated query in Convex for this
    const all = await this.getAllMetrics();
    const metric = all.find((m: any) => m._id === id);

    if (!metric) {
      throw new NotFoundException('Metric not found');
    }
    return metric;
  }
  //update

  async updateMetric(data: UpdateMetricDto) {
    if (!data.id) {
      throw new BadRequestException('Metric ID is required');
    }

    try {
      // Currently your Convex update is empty. Update the Convex mutation first
      const result = await this.convex.mutation(api.metrics.update, data);
      return { success: true, result, message: 'Metric updated successfully' };
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to update metric');
    }
  }
  //delete

  async removeMetric(id: Id<'metrics'>) {
    if (!id) {
      throw new BadRequestException('Metric ID is required');
    }

    try {
      await this.convex.mutation(api.metrics.remove, { id });
      return { success: true, message: 'Metric removed successfully' };
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to remove metric');
    }
  }
}