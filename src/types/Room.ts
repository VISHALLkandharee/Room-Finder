export interface RoomType{
    id: number;
    title: string;
    description: string;
    owner_id: string;
    location: string;
    city:string;
    rent_price:string;
    property_type:string,
    tenant_preference:'family' | 'bachelor' | 'girls' | 'working';
    contact_number:string;
    images : string[];
    created_at:Date;
    updated_at:Date;
}