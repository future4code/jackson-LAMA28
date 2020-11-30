import { ShowBusiness } from "../src/business/ShowBusiness";
import { Show } from "../src/model/Show";

describe("Add Show", ()=>{

  test.skip("Error when user role is not 'ADMIN'", async ()=>{
    const authenticator = {
      getData: jest.fn(() => ({id: "id",role: "NORMAL"}))
    } as any;

    const idGenerator = { generate: jest.fn() } as any;

    const showDatabase = {
      getBookedShows: jest.fn(),
      addShow: jest.fn()
    } as any;

    const bandDatabase = {
      getBands: jest.fn(() => [
        {
          id: "band_id",
          name: "Bad Canadians",
          musicGenre: "roquinho gostoso",
          responsible: "Roberto de Abreu Salgado"
        }
      ])
    } as any;

    const showBusiness = new ShowBusiness(
      authenticator,
      idGenerator,
      showDatabase,
      bandDatabase
    );

    expect.assertions(2);

    try {
      const show = {
        weekDay: "FRIDAY",
        startTime: 15,
        endTime: 17,
        bandId: "bandId"
      };

      const token = "token"

      await showBusiness.addShow(show, token);
    } catch (error) {
      expect(error.code).toBe(401);
      expect(error.message).toBe("Invalid credentials");
    }
  });

  const authenticator = {
    getData: jest.fn(() => ({id: "id",role: "ADMIN"}))
  } as any;

  const idGenerator = { generate: jest.fn() } as any;
  
  const showDatabase = {
    getBookedShows: jest.fn(),
    addShow: jest.fn()
  } as any;

  const bandDatabase = {
    getBands: jest.fn(() => [
      {
        id: "band_id",
        name: "Bad Canadians",
        musicGenre: "roquinho gostoso",
        responsible: "Roberto de Abreu Salgado"
      }
    ])
  } as any;

  const showBusiness: ShowBusiness = new ShowBusiness(
    authenticator,
    idGenerator,
    showDatabase,
    bandDatabase
  );

  test.skip("Error when 'weekday' is empty", async ()=>{
    expect.assertions(2);

    try {
      const show = {
        weekDay: "",
        startTime: 15,
        endTime: 17,
        bandId: "bandId"
      };
      const token = "token"

      await showBusiness.addShow(show, token);
    } catch (error) {
      expect(error.code).toBe(422);
      expect(error.message).toBe("Missing inputs");
    }
  });

  test.skip("Error when 'band id' is empty", async ()=>{
    expect.assertions(2);

    try {
      const show = {
        weekDay: "FRIDAY",
        startTime: 15,
        endTime: 17,
        bandId: ""
      };
      
      const token = "token";

      await showBusiness.addShow(show, token);
    } catch (error) {
      expect(error.code).toBe(422);
      expect(error.message).toBe("Missing inputs");
    }
  });

  test.skip("Error when 'start time' is sooner than 8", async ()=>{
    expect.assertions(2);

    try {
      const show = {
        weekDay: "FRIDAY",
        startTime: 7,
        endTime: 17,
        bandId: "bandId"
      };
      
      const token = "token";

      await showBusiness.addShow(show, token);
    } catch (error) {
      expect(error.code).toBe(422);
      expect(error.message).toBe("Invalid show times");
    }
  });

  test.skip ("Error when 'end time' is later than 23", async ()=>{
    expect.assertions(2);

    try {
      const show = {
        weekDay: "FRIDAY",
        startTime: 15,
        endTime: 24,
        bandId: "bandId"
      };
      
      const token = "token";

      await showBusiness.addShow(show, token);
    } catch (error) {
      expect(error.code).toBe(422);
      expect(error.message).toBe("Invalid show times");
    }
  });

  test("Error when a band is not found", async ()=>{
    const authenticator = {
      getData: jest.fn(() => ({id: "id",role: "ADMIN"}))
    } as any;
  
    const idGenerator = { generate: jest.fn() } as any;
    
    const showDatabase = {
      getBookedShows: jest.fn(),
      addShow: jest.fn()
    } as any;
  
    const bandDatabase = {
      getBands: jest.fn(() => [])
    } as any;
  
    const showBusiness: ShowBusiness = new ShowBusiness(
      authenticator,
      idGenerator,
      showDatabase,
      bandDatabase
    );

    expect.assertions(2);

    try {
      const show = {
        weekDay: "FRIDAY",
        startTime: 15,
        endTime: 17,
        bandId: "bandId"
      };
      
      const token = "token";

      await showBusiness.addShow(show, token);
    } catch (error) {
      expect(error.code).toBe(404);
      expect(error.message).toBe("Band not found");
    }
  });

  test.skip("Error when there is a schedule conflict with another booked show", async ()=>{
    const authenticator = {
      getData: jest.fn(() => ({id: "id",role: "ADMIN"}))
    } as any;
  
    const idGenerator = { generate: jest.fn() } as any;
    
    const showDatabase = {
      getBookedShows: jest.fn(() => [
        Show.toShowModel({
          id: "id",
          week_day: "FRIDAY",
          start_time: 16,
          end_time: 17,
          band_id: "anotherBandId"
        })
      ]),
      addShow: jest.fn()
    } as any;
  
    const bandDatabase = {
      getBands: jest.fn(() => [
        {
          id: "band_id",
          name: "Bad Canadians",
          musicGenre: "roquinho gostoso",
          responsible: "Roberto de Abreu Salgado"
        }
      ])
    } as any;

    const showBusiness: ShowBusiness = new ShowBusiness(
      authenticator,
      idGenerator,
      showDatabase,
      bandDatabase
    );

    expect.assertions(2);

    try {
      const show = {
        weekDay: "FRIDAY",
        startTime: 15,
        endTime: 17,
        bandId: "bandId"
      };
      
      const token = "token";

      await showBusiness.addShow(show, token);
    } catch (error) {
      expect(error.code).toBe(409);
      expect(error.message).toBe("A show is already booked at this time");
    }
  });

  test.skip("Success case", async ()=>{
    const authenticator = {
      getData: jest.fn(() => ({id: "id",role: "ADMIN"}))
    } as any;
  
    const idGenerator = { generate: jest.fn() } as any;
    
    const showDatabase = {
      getBookedShows: jest.fn(() => []),
      addShow: jest.fn()
    } as any;

    const bandDatabase = {
      getBands: jest.fn(() => [
        {
          id: "band_id",
          name: "Bad Canadians",
          musicGenre: "roquinho gostoso",
          responsible: "Roberto de Abreu Salgado"
        }
      ])
    } as any;
  
    const showBusiness: ShowBusiness = new ShowBusiness(
      authenticator,
      idGenerator,
      showDatabase,
      bandDatabase
    );

    expect.assertions(1);

    try {
      const show = {
        weekDay: "FRIDAY",
        startTime: 15,
        endTime: 17,
        bandId: "bandId"
      };
      
      const token = "token";

      const result = await showBusiness.addShow(show, token);

      expect(result).toBeDefined();
    } catch (error) {
    
    }
  });

});

describe.skip("Get Day Shows", ()=>{
  const authenticator = { generateToken: jest.fn() } as any;
  const idGenerator = { generate: jest.fn() } as any;
  const showDatabase = { getDayShows: jest.fn() } as any;
  const bandDatabase = {} as any;

  const showBusiness: ShowBusiness = new ShowBusiness(
    authenticator,
    idGenerator,
    showDatabase,
    bandDatabase
  );

  test("Error when 'day' query is empty", async ()=>{
    expect.assertions(2);

    try {
      const input = {
        day: ""
      }
      
      const token = "token";

      await showBusiness.getDayShows(input, token);
    } catch (error) {
      expect(error.code).toBe(422);
      expect(error.message).toBe("Missing input");
    }
  });

  test("Error when 'day' query is invalid", async ()=>{
    expect.assertions(2);

    try {
      const input = {
        day: "thrusday",
      }
      
      const token = "token";

      await showBusiness.getDayShows(input, token);
    } catch (error) {
      expect(error.code).toBe(422);
      expect(error.message).toBe("Invalid show day");
    }
  });

  test("Success case", async ()=>{
    const authenticator = {
      getData: jest.fn(() => ({id: "id",role: "NORMAL"}))
    } as any;

    const idGenerator = { generate: jest.fn() } as any;

    const showDatabase = { 
      getDayShows: jest.fn(() => [
        {
          name: "Bad Canadians",
          musicGenre: "roquinho gostoso"
        },
        {
          name: "The Parking Lots",
          musicGenre: "folk-punk"
        }
      ])
    } as any;

    const bandDatabase = {} as any;

    const showBusiness: ShowBusiness = new ShowBusiness(
      authenticator,
      idGenerator,
      showDatabase,
      bandDatabase
    );

    expect.assertions(1);

    try {
      const input = {
        day: "FRIDAY"
      }
      
      const token = "token";

      const result = await showBusiness.getDayShows(input, token);

      expect(result).toBeDefined();
    } catch (error) {
    
    }
  });

});