import { BandBusiness } from "../src/business/BandBusiness";

describe.skip("Register Band", ()=>{
  
  test("Error when user role is not 'ADMIN'", async ()=>{
    const authenticator = {
      getData: jest.fn(() => ({id: "id",role: "NORMAL"}))
    } as any;

    const idGenerator = { generate: jest.fn() } as any;

    const bandDatabase = { registerBand: jest.fn() } as any;

    const bandBusiness: BandBusiness = new BandBusiness(
      authenticator,
      idGenerator,
      bandDatabase
    );

    expect.assertions(2);

    try {
      const band = {
        name: "Bad Canadians",
        musicGenre: "roquinho gostoso",
        responsible: "Roberto de Abreu Salgado"
      };

      const token = "token";

      await bandBusiness.registerBand(band, token);
    } catch (error) {
      expect(error.code).toBe(401);
      expect(error.message).toBe("Invalid credentials");
    }
  });

  const authenticator = {
    getData: jest.fn(() => ({id: "id",role: "ADMIN"}))
  } as any;

  const idGenerator = { generate: jest.fn() } as any;
  
  const bandDatabase = { registerBand: jest.fn() } as any;

  const bandBusiness: BandBusiness = new BandBusiness(
    authenticator,
    idGenerator,
    bandDatabase
  );

  test("Error when 'name' is empty", async ()=>{
    expect.assertions(2);

    try {
      const band = {
        name: "",
        musicGenre: "roquinho gostoso",
        responsible: "Roberto de Abreu Salgado"
      };

      const token = "token";

      await bandBusiness.registerBand(band, token);
    } catch (error) {
      expect(error.code).toBe(422);
      expect(error.message).toBe("Missing inputs");
    }
  });

  test("Error when 'musicGenre' is empty", async ()=>{
    expect.assertions(2);

    try {
      const band = {
        name: "Bad Canadians",
        musicGenre: "",
        responsible: "Roberto de Abreu Salgado"
      };

      const token = "token";

      await bandBusiness.registerBand(band, token);
    } catch (error) {
      expect(error.code).toBe(422);
      expect(error.message).toBe("Missing inputs");
    }
  });

  test("Error when 'responsible' is empty", async ()=>{
    expect.assertions(2);

    try {
      const band = {
        name: "Bad Canadians",
        musicGenre: "roquinho gostoso",
        responsible: "",
      };

      const token = "token";

      await bandBusiness.registerBand(band, token);
    } catch (error) {
      expect(error.code).toBe(422);
      expect(error.message).toBe("Missing inputs");
    }
  });

  test("Success case", async ()=>{
    expect.assertions(1);

    try {
      const band = {
        name: "Bad Canadians",
        musicGenre: "roquinho gostoso",
        responsible: "Roberto de Abreu Salgado"
      };

      const token = "token";

      const result = await bandBusiness.registerBand(band, token);
      expect(result).toBeDefined();
    } catch (error) {
      
    }
  })
});