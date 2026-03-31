import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface SheetData {
  title: string;
  data: any[][];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const apiKey = Deno.env.get('GOOGLE_API_KEY');
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY not configured');
    }

    const { title, data }: SheetData = await req.json();

    const spreadsheetBody = {
      properties: {
        title: title,
      },
      sheets: [
        {
          properties: {
            title: 'Candidate Rankings',
            gridProperties: {
              rowCount: data.length,
              columnCount: data[0]?.length || 15,
            },
          },
          data: [
            {
              startRow: 0,
              startColumn: 0,
              rowData: data.map(row => ({
                values: row.map(cell => ({
                  userEnteredValue: {
                    stringValue: String(cell ?? ''),
                  },
                })),
              })),
            },
          ],
        },
      ],
    };

    const createResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(spreadsheetBody),
      }
    );

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      throw new Error(`Failed to create sheet: ${errorText}`);
    }

    const sheet = await createResponse.json();
    const spreadsheetId = sheet.spreadsheetId;

    const batchUpdateBody = {
      requests: [
        {
          repeatCell: {
            range: {
              sheetId: 0,
              startRowIndex: 0,
              endRowIndex: 1,
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: {
                  red: 0.2,
                  green: 0.4,
                  blue: 0.8,
                },
                textFormat: {
                  foregroundColor: {
                    red: 1,
                    green: 1,
                    blue: 1,
                  },
                  fontSize: 14,
                  bold: true,
                },
              },
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat)',
          },
        },
        {
          repeatCell: {
            range: {
              sheetId: 0,
              startRowIndex: 5,
              endRowIndex: 6,
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: {
                  red: 0.9,
                  green: 0.9,
                  blue: 0.9,
                },
                textFormat: {
                  bold: true,
                },
              },
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat)',
          },
        },
        {
          autoResizeDimensions: {
            dimensions: {
              sheetId: 0,
              dimension: 'COLUMNS',
              startIndex: 0,
              endIndex: data[0]?.length || 15,
            },
          },
        },
      ],
    };

    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(batchUpdateBody),
      }
    );

    const shareUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

    return new Response(
      JSON.stringify({
        spreadsheetId,
        url: shareUrl,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error('Error creating Google Sheet:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
