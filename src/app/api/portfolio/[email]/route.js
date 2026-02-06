import { withAuth } from "@/middleware/withAuth.js";
import { NextResponse } from "next/server";
import { getPortfolioFromMongoDB } from "@/lib/portfolio.js";

export const GET = withAuth(async (req, { params }) => {
    try {
        const { email } = await params;
        const portfolio = await getPortfolioFromMongoDB(email);
        if (!portfolio) return NextResponse.json({ message: 'Portfolio not found' }, { status: 404 });
        
        return NextResponse.json(portfolio);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to get portfolio' }, { status: 500 });
    }
}, ['admin', 'user']);
