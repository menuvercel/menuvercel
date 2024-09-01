import { NextResponse } from 'next/server';
import { sql } from '@/vercel/postgres';

export async function GET() {
  try {
    const sectionsResult = await sql`SELECT * FROM sections`;
    const itemsResult = await sql`SELECT * FROM items`;

    const sections = sectionsResult.rows;
    const items = itemsResult.rows.reduce((acc, item) => {
      if (!acc[item.section_id]) {
        acc[item.section_id] = [];
      }
      acc[item.section_id].push(item);
      return acc;
    }, {});

    return NextResponse.json({ sections, items });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching menu data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { type, data } = await request.json();

    if (type === 'section') {
      const { name, image } = data;
      const result = await sql`
        INSERT INTO sections (name, image)
        VALUES (${name}, ${image})
        RETURNING *
      `;
      return NextResponse.json(result.rows[0]);
    } else if (type === 'item') {
      const { section_id, name, price, image, description } = data;
      const result = await sql`
        INSERT INTO items (section_id, name, price, image, description)
        VALUES (${section_id}, ${name}, ${price}, ${image}, ${description})
        RETURNING *
      `;
      return NextResponse.json(result.rows[0]);
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating item' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { type, id, data } = await request.json();

    if (type === 'section') {
      const { name, image } = data;
      const result = await sql`
        UPDATE sections
        SET name = ${name}, image = ${image}
        WHERE id = ${id}
        RETURNING *
      `;
      return NextResponse.json(result.rows[0]);
    } else if (type === 'item') {
      const { name, price, image, description } = data;
      const result = await sql`
        UPDATE items
        SET name = ${name}, price = ${price}, image = ${image}, description = ${description}
        WHERE id = ${id}
        RETURNING *
      `;
      return NextResponse.json(result.rows[0]);
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating item' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { type, id } = await request.json();

    if (type === 'section') {
      await sql`DELETE FROM sections WHERE id = ${id}`;
    } else if (type === 'item') {
      await sql`DELETE FROM items WHERE id = ${id}`;
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting item' }, { status: 500 });
  }
}