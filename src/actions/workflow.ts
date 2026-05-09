'use server';

import connectDB from '@/lib/mongoose';
import Workflow from '@/models/Workflow';
import { getCurrentUser } from './auth';
import { createNotification } from '@/lib/notifications';

export async function getMyWorkflows() {
  try {
    await connectDB();
    const user = await getCurrentUser();
    
    if (!user) {
      return { error: 'Unauthorized' };
    }

    const workflows = await Workflow.find({ user: user.id }).sort('-updatedAt');
    return { data: JSON.parse(JSON.stringify(workflows)) };
  } catch (error) {
    return { error: 'Server error' };
  }
}

export async function createWorkflowAction() {
  try {
    await connectDB();
    const user = await getCurrentUser();
    
    if (!user) {
      return { error: 'Unauthorized' };
    }

    const workflow = await Workflow.create({
      name: 'New Workflow',
      user: user.id
    });

    await createNotification({
      userId: user.id,
      title: 'Workflow Created',
      message: `Your new workflow "${workflow.name}" is ready.`,
      type: 'success'
    });
    
    return { success: true, workflowId: workflow._id.toString() };
  } catch (error: any) {
    return { error: 'Failed to create workflow' };
  }
}

export async function getWorkflow(id: string) {
  try {
    await connectDB();
    const workflow = await Workflow.findById(id);
    if (!workflow) return { error: 'Not found' };
    return JSON.parse(JSON.stringify(workflow));
  } catch (error) {
    return { error: 'Server error' };
  }
}

export async function saveWorkflow(id: string, data: any) {
  try {
    await connectDB();
    const workflow = await Workflow.findByIdAndUpdate(id, data, { new: true });
    return { success: true, workflow: JSON.parse(JSON.stringify(workflow)) };
  } catch (error) {
    return { error: 'Failed to save workflow' };
  }
}

export async function deleteWorkflowAction(id: string) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return { error: 'Unauthorized' };

    const workflow = await Workflow.findOneAndDelete({ _id: id, user: user.id });
    if (!workflow) return { error: 'Workflow not found' };

    await createNotification({
      userId: user.id,
      title: 'Workflow Deleted',
      message: `Workflow "${workflow.name}" has been removed.`,
      type: 'warning'
    });

    return { success: true };
  } catch (error) {
    return { error: 'Failed to delete workflow' };
  }
}
