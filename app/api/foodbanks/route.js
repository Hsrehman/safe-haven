import { NextResponse } from "next/server";

export async function GET() {
  
  const foodBanksData = {
    success: true,
    data: [
      {
        _id: "1",
        name: "North London Food Bank",
        latitude: 51.5514,
        longitude: -0.1577,
        address: "123 Example St, London",
        hours: "Mon-Fri 9AM-5PM"
      },
      {
        _id: "2",
        name: "Wandsworth Food Bank",
        latitude: 51.4577,
        longitude: -0.191,
        address: "St Mark's Church, Battersea Rise, London SW11 1EJ",
        hours: "Mon-Fri 10AM-4PM"
      },
      {
        _id: "3",
        name: "Newham Food Bank",
        latitude: 51.5155,
        longitude: 0.0352,
        address: "St Mark's Centre, 218 Tollgate Road, Beckton, London E6 5YA",
        hours: "Tue-Sat 9AM-5PM"
      },
      {
        _id: "4",
        name: "Living Well Bromley Food Bank",
        latitude: 51.4106,
        longitude: -0.0491,
        address: "Holy Trinity Church, 66 Lennard Road, London SE20 7LX",
        hours: "Mon-Thu 9AM-3PM"
      },
      {
        _id: "5",
        name: "Kensington & Chelsea Food Bank",
        latitude: 51.5145,
        longitude: -0.205,
        address: "Notting Hill Methodist Church, 240 Lancaster Rd, London W11 4AH",
        hours: "Mon-Fri 10AM-6PM"
      },
      {
        _id: "6",
        name: "Eat or Heat Food Bank",
        latitude: 51.586,
        longitude: -0.019,
        address: "1A Jewel Road, Walthamstow, London E17 4QU",
        hours: "Wed-Sat 10AM-4PM"
      },
      {
        _id: "7",
        name: "South Norwood Community Kitchen",
        latitude: 51.3983,
        longitude: -0.0755,
        address: "South Norwood Baptist Church, 2 Oliver Ave, London SE25 6TY",
        hours: "Mon-Fri 9:30AM-4:30PM"
      }
    ]
  };

  return NextResponse.json(foodBanksData);
}
