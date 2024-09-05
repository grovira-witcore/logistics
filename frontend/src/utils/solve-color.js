// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

export function solveColor(colorName) {
  switch (colorName) {
    case 'blue': {
      return '#007BFF';
    }
    case 'red': {
      return '#DC3545';
    }
    case 'orange': {
      return '#FFA500';
    }
    case 'yellow': {
      return '#FFC107';
    }
    case 'green': {
      return '#28A745';
    }
    case 'purple': {
      return '#800080';
    }
    case 'pink': {
      return '#FFC0CB';
    }
    case 'brown': {
      return '#A52A2A';
    }
    case 'sky-blue': {
      return '#87CEEB';
    }
    case 'turquoise': {
      return '#40E0D0';
    }
    case 'gold': {
      return '#FFD700';
    }
    case 'gray': {
      return '#808080';
    }
    default: {
      return '#000000';
    }
  }
}
