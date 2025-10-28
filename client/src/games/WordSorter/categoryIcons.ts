import {
    Apple,
    Dog,
    Pencil,
    Palette,
    Shirt,
    Activity,
    Smile,
    Hash,
    Circle,
    Globe,
    Utensils,
    Briefcase,
    Home,
    Car,
    Cloud,
    Grid
  } from "lucide-react";
  
  
  export const categoryIcons: Record<string, React.ElementType> = {
    fruits: Apple,
    animals: Dog,
    stationery: Pencil,
    colors: Palette,
    dothes: Shirt, 
    actions: Activity,
    emotions: Smile,
    numbers: Hash,
    shapes: Circle,
    countries: Globe,
    foods: Utensils,
    professions: Briefcase,
    "household items": Home,
    transport: Car,
    weather: Cloud,
    General: Grid 
  };
  
  
  export const getCategoryIcon = (name: string): React.ElementType => {
    const key = name.toLowerCase().trim();
    return categoryIcons[key] || Grid;
  };
  