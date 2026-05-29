import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://efdbgbdeqjzrrwuxmsps.supabase.co";
const supabaseKey = "sb_publishable_TpnbIVPjaxtyZjK2zpN1_A_TIo4i3OX";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);