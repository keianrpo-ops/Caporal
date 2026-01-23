
export type MenuCategory = 
  | 'Entradas' 
  | 'Platos de Autor' 
  | 'Gourmet' 
  | 'Tradición' 
  | 'DOMINGOS DEL TÍPICO' 
  | 'Coctelería' 
  | 'Postres' 
  | 'Menú Canino Gourmet';

export interface MenuItem {
  id: string;
  categoria: MenuCategory;
  nombre_plato: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
  disponible: boolean;
  created_at?: string;
}

export interface Room {
  id: string;
  nombre: string;
  descripcion: string;
  precio_noche: number;
  imagen_url: string;
  disponible: boolean;
  created_at?: string;
}

export interface Pet {
  id: string;
  cliente_id: string;
  nombre: string;
  raza: string;
  notas_gourmet: string;
  created_at?: string;
}

export interface Reservation {
  id: string;
  user_id?: string;
  nombre: string;
  celular: string;
  fecha: string;
  hora: string;
  personas: number;
  con_mascota: boolean;
  numero_mascotas: number;
  nombre_mascota?: string;
  es_experiencia_especial: boolean;
  incluye_alojamiento: boolean;
  tipo_alojamiento?: string;
  duracion_estancia?: string;
  platos_preseleccionados?: string;
  detalles_especiales?: string;
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'asistida';
  created_at?: string;
}

export interface ClientProfile {
  id: string;
  nombre: string;
  celular: string;
  puntos: number;
  visitas: number;
  nivel_lealtad: 'Bronce' | 'Plata' | 'Oro';
  email?: string;
  // Relationship field for pet management in the CRM dashboard
  mascotas_clientes?: Pet[];
}