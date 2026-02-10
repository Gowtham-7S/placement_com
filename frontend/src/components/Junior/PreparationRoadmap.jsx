import React from 'react';
import Card from '../Common/Card';
import './Junior.css';

const PreparationRoadmap = () => {
  return (
    <div className="junior-dashboard">
      <div className="dashboard-header">
        <h1>Preparation Roadmap</h1>
        <p>Get a structured preparation guide based on insights</p>
      </div>

      <Card>
        <Card.Header>Your Preparation Journey</Card.Header>
        <Card.Body>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ borderLeft: '4px solid var(--primary)', paddingLeft: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: 'var(--primary)' }}>Phase 1: Foundation (Weeks 1-2)</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)' }}>
                <li>Data Structures: Arrays, Linked Lists, Stacks, Queues</li>
                <li>Complexity Analysis: Time & Space</li>
                <li>Basic Algorithms: Sorting, Searching</li>
              </ul>
            </div>

            <div style={{ borderLeft: '4px solid var(--secondary)', paddingLeft: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: 'var(--secondary)' }}>Phase 2: Core Concepts (Weeks 3-6)</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)' }}>
                <li>Trees & Graphs: Binary Trees, BST, Graph Traversal</li>
                <li>Advanced Algorithms: DP, Greedy, Backtracking</li>
                <li>System Design Basics</li>
              </ul>
            </div>

            <div style={{ borderLeft: '4px solid var(--success)', paddingLeft: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: 'var(--success)' }}>Phase 3: Practice & Interview Prep (Weeks 7-12)</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)' }}>
                <li>Solve LeetCode Medium & Hard problems</li>
                <li>Mock Interviews</li>
                <li>HR Preparation</li>
              </ul>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>Most Asked Topics (Coming Soon)</Card.Header>
        <Card.Body>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
            Topic insights will be populated from approved interview experiences
          </p>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>Recommended Resources</Card.Header>
        <Card.Body>
          <ul style={{ color: 'var(--text-secondary)' }}>
            <li><a href="https://leetcode.com" target="_blank" rel="noopener noreferrer">LeetCode - Practice Problems</a></li>
            <li><a href="https://www.geeksforgeeks.org" target="_blank" rel="noopener noreferrer">GeeksforGeeks - Learn & Practice</a></li>
            <li><a href="https://www.interviewbit.com" target="_blank" rel="noopener noreferrer">InterviewBit - Interview Prep</a></li>
            <li><a href="https://www.educative.io" target="_blank" rel="noopener noreferrer">Educative - Beginner Friendly</a></li>
          </ul>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PreparationRoadmap;
