import type { ActionFunction, LoaderFunction} from "@remix-run/node";
import { json } from "@remix-run/node"; // or cloudflare/deno

export const loader: LoaderFunction = async ({ request }) => {
    return json(
        { success: true },
        {
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        }
    );
};


export const action: ActionFunction = async ({ request }) => {
    if (request.method == 'POST') {
        console.log("**************************************8For data request");
    }
    return json(
        { status: true },
        {
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        }
    );
};
