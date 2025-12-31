export const userList = [
    {
      id: 1,
      name: "Ananya Gupta",
      registeredOn: "18 Mar, 2025",
      inPersonMode: "In person mode",
      location: {
        state: "Maharashtra",
        district: "Pune",
        block: "Katraj",
        village: "Narhe",
      },
      phoneNumber: "9876543210",
      email: "ananya.gupta@example.com",
      birthDate: "15 May, 1995",
      callLogs: [
        { date: "18 Mar, 2025", status: "Answered", note: "Showed interest. Wants to discuss with family" },
      ],
      isNew: true,
      preTestStatus: 'pending',
      modeType: 'in-person' as 'in-person' | 'remote'
    },
    {
      id: 2,
      name: "Abhinandini Sawant",
      registeredOn: "2 Feb, 2025",
      inPersonMode: "In person mode",
      location: {
        state: "Maharashtra",
        district: "Pune",
        block: "Katraj",
        village: "Narhe",
      },
      phoneNumber: "8765432109",
      email: "abhinandini@example.com",
      birthDate: "22 Aug, 1998",
      callLogs: [],
      isNew: false,
      preTestStatus: 'completed',
      modeType: 'in-person' as 'in-person' | 'remote'
    },
    {
      id: 3,
      name: "Aisha Sharma",
      registeredOn: "27 Feb, 2025",
      inPersonMode: "Remote mode",
      location: {
        state: "Maharashtra",
        district: "Pune",
        block: "Katraj",
        village: "Narhe",
      },
      phoneNumber: "992048324",
      email: "aisha19@email.com",
      birthDate: "2 Feb, 1999",
      callLogs: [],
      isNew: false,
      preTestStatus: 'completed',
      modeType: 'remote' as 'in-person' | 'remote'
    },
  ];
  