import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, CareerRecommendation, RoadmapTask } from '../types';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  recommendation: CareerRecommendation | null;
  roadmap: RoadmapTask[];
}

interface AppContextType extends AppState {
  login: (user?: User) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  setRecommendation: (rec: CareerRecommendation) => void;
  updateRoadmapTask: (id: string, status: RoadmapTask['status']) => void;
  generateRoadmap: (path: string) => void;
}

const defaultUser: User = {
  id: 'demo-123',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  college: 'National Institute of Technology',
  branch: 'Computer Science',
  semester: '5',
  cgpa: '8.4',
  skills: ['Python', 'Java', 'SQL'],
  projects: ['Portfolio Website'],
  certifications: ['AWS Cloud Practitioner'],
  badges: [],
};

const defaultState: AppState = {
  user: null, // Start null to show landing page
  isAuthenticated: false,
  recommendation: null,
  roadmap: [],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('pathforward_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultState;
      }
    }
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem('pathforward_state', JSON.stringify(state));
  }, [state]);

  const login = (user: User = defaultUser) => {
    setState((prev) => ({ ...prev, user, isAuthenticated: true }));
  };

  const logout = () => {
    setState(defaultState);
  };

  const updateUser = (data: Partial<User>) => {
    setState((prev) => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...data } : null,
    }));
  };

  const setRecommendation = (rec: CareerRecommendation) => {
    setState((prev) => ({ ...prev, recommendation: rec }));
  };

  const updateRoadmapTask = (id: string, status: RoadmapTask['status']) => {
    setState((prev) => {
      const newRoadmap = prev.roadmap.map((task) =>
        task.id === id ? { ...task, status } : task
      );
      
      let updatedUser = prev.user;
      
      // Award badge if a task is marked as completed
      if (status === 'completed' && prev.user) {
        const task = prev.roadmap.find(t => t.id === id);
        if (task) {
          const badgeId = `badge-task-${id}`;
          const hasBadge = prev.user.badges?.some(b => b.id === badgeId);
          
          if (!hasBadge) {
            const newBadge = {
              id: badgeId,
              name: `${task.title} Pioneer`,
              description: `Awarded for completing the ${task.title} module.`,
              iconName: 'Award',
              earnedAt: new Date().toISOString(),
            };
            
            updatedUser = {
              ...prev.user,
              badges: [...(prev.user.badges || []), newBadge],
            };
          }
        }
      } else if (prev.user) {
        // Remove badge if task is un-completed
        const badgeId = `badge-task-${id}`;
        const hasBadge = prev.user.badges?.some(b => b.id === badgeId);
        
        if (hasBadge) {
          updatedUser = {
            ...prev.user,
            badges: prev.user.badges.filter(b => b.id !== badgeId),
          };
        }
      }

      return {
        ...prev,
        roadmap: newRoadmap,
        user: updatedUser,
      };
    });
  };

  const generateRoadmap = (path: string) => {
    // Generate a mock roadmap based on the path
    const mockTasks: RoadmapTask[] = [
      { id: '1', semester: 3, title: 'Python fundamentals', status: 'completed' },
      { id: '2', semester: 3, title: 'Git & GitHub', status: 'completed' },
      { id: '3', semester: 3, title: 'SQL', status: 'in_progress' },
      { id: '4', semester: 4, title: 'Advanced DSA', status: 'not_started' },
      { id: '5', semester: 4, title: 'Web development', status: 'not_started' },
      { id: '6', semester: 5, title: 'System design fundamentals', status: 'not_started' },
      { id: '7', semester: 5, title: 'Internship preparation', status: 'not_started' },
    ];
    const initialBadges = mockTasks
      .filter(t => t.status === 'completed')
      .map(t => ({
        id: `badge-task-${t.id}`,
        name: `${t.title} Pioneer`,
        description: `Awarded for completing the ${t.title} module.`,
        iconName: 'Award',
        earnedAt: new Date().toISOString(),
      }));

    setState((prev) => {
      let updatedUser = prev.user;
      if (updatedUser) {
        updatedUser = {
          ...updatedUser,
          careerPath: path,
          badges: [...(updatedUser.badges || []).filter(b => !b.id.startsWith('badge-task-')), ...initialBadges],
        };
      }
      return { ...prev, roadmap: mockTasks, user: updatedUser };
    });
  };

  return (
    <AppContext.Provider
      value={{ ...state, login, logout, updateUser, setRecommendation, updateRoadmapTask, generateRoadmap }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
