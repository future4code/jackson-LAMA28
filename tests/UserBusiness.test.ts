import { UserBusiness } from "../src/business/UserBusiness"
import { User } from "../src/model/User";

describe.skip("Signup", ()=>{
  const idGenerator = { generate: jest.fn() } as any;
  const hashManager = { hash: jest.fn() } as any;
  const authenticator = { generateToken: jest.fn() } as any;
  const userDatabase = { createUser: jest.fn() } as any;

  const userBusiness: UserBusiness = new UserBusiness(
    idGenerator,
    hashManager,
    authenticator,
    userDatabase
  );

  test("Error when 'name' is empty", async ()=>{
    expect.assertions(2);

    try {
      const user = {
        name: "",
        email: "ban@lama.com",
        password: "123456",
        role: "NORMAL"
      };

      await userBusiness.createUser(user);
    } catch (error) {
      expect(error.code).toBe(422);
      expect(error.message).toBe("Missing inputs");
    }
  });

  test("Error when 'email' is empty", async ()=>{
    expect.assertions(2);

    try {
      const user = {
        name: "Bananinha",
        email: "",
        password: "123456",
        role: "NORMAL"
      };

      await userBusiness.createUser(user);
    } catch (error) {
      expect(error.code).toBe(422);
      expect(error.message).toBe("Missing inputs");
    }
  });

  test("Error when 'password' is empty", async ()=>{
    expect.assertions(2);

    try {
      const user = {
        name: "Bananinha",
        email: "ban@lama.com",
        password: "",
        role: "NORMAL"
      };

      await userBusiness.createUser(user);
    } catch (error) {
      expect(error.code).toBe(422);
      expect(error.message).toBe("Missing inputs");
    }
  });

  test("Error when 'role' is empty", async ()=>{
    expect.assertions(2);

    try {
      const user = {
        name: "Bananinha",
        email: "ban@lama.com",
        password: "123456",
        role: ""
      };

      await userBusiness.createUser(user);
    } catch (error) {
      expect(error.code).toBe(422);
      expect(error.message).toBe("Missing inputs");
    }
  });

  test("Error when 'email' is invalid", async ()=>{
    expect.assertions(2);

    try {
      const user = {
        name: "Bananinha",
        email: "banlama.com",
        password: "123456",
        role: "ADMIN"
      };

      await userBusiness.createUser(user);
    } catch (error) {
      expect(error.code).toBe(422);
      expect(error.message).toBe("Invalid Email!");
    }
  });

  test("Error when 'password' is invalid", async ()=>{
    expect.assertions(2);

    try {
      const user = {
        name: "Bananinha",
        email: "ban@lama.com",
        password: "123",
        role: "ADMIN"
      };

      await userBusiness.createUser(user);
    } catch (error) {
      expect(error.code).toBe(422);
      expect(error.message).toBe("Invalid Password!");
    }
  });

  test("Error when 'role' is invalid", async ()=>{
    expect.assertions(2);

    try {
      const user = {
        name: "Bananinha",
        email: "ban@lama.com",
        password: "123456",
        role: "ADMINISTRADORA"
      };

      await userBusiness.createUser(user);
    } catch (error) {
      expect(error.code).toBe(422);
      expect(error.message).toBe("Invalid user role");
    }
  });

  test("Success case", async ()=>{
    expect.assertions(1);

    try {
      const user = {
        name: "Bananinha",
        email: "ban@lama.com",
        password: "123456",
        role: "ADMIN"
      };

      const result = await userBusiness.createUser(user);

      expect(result).toBeDefined();
    } catch (error) {
      
    }
  })
});

describe.skip("Login", ()=>{
  const idGenerator = {} as any
  const hashManager = { compare: jest.fn() } as any
  const authenticator = { generateToken: jest.fn() } as any
  const userDatabase = { getUserByEmail: jest.fn() } as any

  const userBusiness: UserBusiness = new UserBusiness(
    idGenerator,
    hashManager,
    authenticator,
    userDatabase
  )

  test("Error when 'email' is empty", async ()=>{
    expect.assertions(2)

    try {
      const user = {
        email: "",
        password: "123456"
      };

      await userBusiness.getUserByEmail(user)
    } catch (error) {
      expect(error.message).toBe("Missing inputs")
      expect(error.code).toBe(422)
    }
  });

  test("Error when 'password' is empty", async ()=>{
    expect.assertions(2)

    try {
      const user = {
        email: "ban@lama.com",
        password: ""
      };

      await userBusiness.getUserByEmail(user)
    } catch (error) {
      expect(error.message).toBe("Missing inputs")
      expect(error.code).toBe(422)
    }
  });

  test("Error when 'email' is invalid", async ()=>{
    const idGenerator = {} as any;
    const hashManager = { compare: jest.fn() } as any;
    const authenticator = { generateToken: jest.fn() } as any;

    const userDatabase = {
      getUserByEmail: jest.fn(
        () => undefined
      )
    } as any;
  
    const userBusiness: UserBusiness = new UserBusiness(
      idGenerator,
      hashManager,
      authenticator,
      userDatabase
    );

    expect.assertions(2);

    try {
      const user = {
        email: "ban@lama.com",
        password: "123456"
      };

      await userBusiness.getUserByEmail(user);
    } catch (error) {
      expect(error.message).toBe("Invalid credentials");
      expect(error.code).toBe(401);
    }
  });

  test("Error when 'password' is invalid", async ()=>{
    const idGenerator = {} as any;

    const hashManager = { 
      compare: jest.fn(
        () => false
      ) 
    } as any;

    const authenticator = { generateToken: jest.fn() } as any;

    const userDatabase = { getUserByEmail: jest.fn() } as any;
  
    const userBusiness: UserBusiness = new UserBusiness(
      idGenerator,
      hashManager,
      authenticator,
      userDatabase
    );

    expect.assertions(2);

    try {
      const user = {
        email: "ban@lama.com",
        password: "123456"
      };

      await userBusiness.getUserByEmail(user);
    } catch (error) {
      expect(error.message).toBe("Invalid credentials");
      expect(error.code).toBe(401);
    }
  });

  test("Success case", async ()=>{
    const idGenerator = {} as any;

    const hashManager = { compare: jest.fn(() => true) } as any;

    const authenticator = { generateToken: jest.fn() } as any;

    const userDatabase = { 
      getUserByEmail: jest.fn(() => User.toUserModel({
        id: "id",
        name: "Bananinha",
        email: "ban@lama.com",
        password: "123456",
        role: "ADMIN"
      }))
    } as any;
  
    const userBusiness: UserBusiness = new UserBusiness(
      idGenerator,
      hashManager,
      authenticator,
      userDatabase
    );

    expect.assertions(1);

    try {
      const user = {
        email: "ban@lama.com",
        password: "123456"
      };

      const result = await userBusiness.getUserByEmail(user);

      expect(result).toBeDefined();
    } catch (error) {
      
    }
  })
});