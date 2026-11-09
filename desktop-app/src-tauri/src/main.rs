// රූපසිද්ධි — Windows ඇප් එක (Tauri). වෙබ් ගොනු (www) .exe එක ඇතුළේම ඇති නිසා offline ක්‍රියා කරයි.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running Rupasiddhi");
}
