import { MarketExplorer } from "@/components/market/market-explorer";
import { marketVerticals } from "@/domain/market/market-data";
import { notFound } from "next/navigation";
export function generateStaticParams(){return marketVerticals.map(v=>({slug:v.id}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const v=marketVerticals.find(item=>item.id===slug);return {title:v?.title??"Mercados"};}
export default async function MarketDetailPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(!marketVerticals.some(v=>v.id===slug))notFound();return <MarketExplorer initialId={slug}/>;}
