class SelectString  {
  public static readonly code: string
  public static readonly title: string
  public constructor(code: string, title: string) {

  }
}

const  UserRole =  {
  EMPLOYEE: {
    code:"EMPLOYEE",
    name:"Employee"
  },
  SUPERVISOR:{
    code:"SUPERVISOR",
    name:"Supervisor"
  },
  ADMIN:{
    code:"ADMIN",
    name:"Admin"
  },
  SUPERADMIN:{
    code:"SUPERADMIN",
    name:"Super Admin"
  }

}


const UserGroup = {
  BANK:{
    code:"BANK",
    name:"Bank",
    roles:[
      UserRole.EMPLOYEE,
      UserRole.SUPERVISOR
    ]
  },
  MANAGER:{
    code:"MANAGER",
    name:"Program Manager",
    roles:[
      UserRole.ADMIN,
      UserRole.SUPERADMIN
    ]
  },
}

const PAGE_SIZE = 9

export {UserGroup, UserRole, PAGE_SIZE}
