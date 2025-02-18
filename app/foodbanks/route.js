import { NextResponse } from 'next/server';

export async function GET(req, res) {
  const foodBanks = [
    {
      id: 1,
      name: "Trussell Trust Food Bank - Waterloo",
      latitude: 51.5031,
      longitude: -0.1143,
      address: "Waterloo Food Bank, London SE1"
    },
    {
      id: 2,
      name: "Wandsworth Food Bank",
      latitude: 51.4577,
      longitude: -0.1910,
      address: "St Mark's Church, Battersea Rise, London SW11 1EJ"
    },
    {
      id: 3,
      name: "Newham Food Bank",
      latitude: 51.5155,
      longitude: 0.0352,
      address: "St Mark's Centre, 218 Tollgate Road, Beckton, London E6 5YA"
    },
    {
      id: 4,
      name: "Living Well Bromley Food Bank",
      latitude: 51.4106,
      longitude: -0.0491,
      address: "Holy Trinity Church, 66 Lennard Road, London SE20 7LX"
    },
    {
      id: 5,
      name: "Kensington & Chelsea Food Bank",
      latitude: 51.5145,
      longitude: -0.2050,
      address: "Notting Hill Methodist Church, 240 Lancaster Rd, London W11 4AH"
    },
    {
      id: 6,
      name: "Eat or Heat Food Bank",
      latitude: 51.5860,
      longitude: -0.0190,
      address: "1A Jewel Road, Walthamstow, London E17 4QU"
    },
    {
      id: 7,
      name: "South Norwood Community Kitchen",
      latitude: 51.3983,
      longitude: -0.0755,
      address: "South Norwood Baptist Church, 2 Oliver Ave, London SE25 6TY"
    }
  ];

  return NextResponse.json(foodBanks);
}