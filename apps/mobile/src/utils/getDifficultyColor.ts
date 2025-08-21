const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'easy': return '#4ade80';
      case 'medium': return '#fbbf24';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };
  