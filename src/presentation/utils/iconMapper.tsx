import {
  Home as HomeIcon,
  Folder as FolderIcon,
  CheckBox as CheckBoxIcon, // ✅ Reemplaza CheckSquare
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';

export const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, any> = {
    home: HomeIcon,
    folder: FolderIcon,
    'check-square': CheckBoxIcon,
    'bar-chart': BarChartIcon,
    settings: SettingsIcon,
    description: DescriptionIcon,
  };

  return iconMap[iconName.toLowerCase()] || HomeIcon;
};