import {
  seriesTeamModalCreate,
  seriesTeamModalDelete,
  seriesTeamModalGet,
  seriesTeamModalUpdate,
  searchSeriesTeam,
} from '../modal/seriesTeamModal';
import {
  TSeriesTeamProductionCompanyCreate,
  TSeriesTeamProductionCompanyUpdate,
  TPersonCreate,
} from '../types/seriesTeam.types';

const registerProductionCompany = async (
  data: TSeriesTeamProductionCompanyCreate
) => {
  try {
    const register = await seriesTeamModalCreate.registerProductionCompany(data);
    if (!register) {
      return {
        success: false,
        message: 'Failed to register the production company',
      };
    }
    return {
      success: true,
      message: 'Production comapny regsiter',
    };
  } catch (err) {
    return {
      success: false,
      message: 'Unexpected error : Failed to register the production comapny',
    };
  }
};
const registerSeriesProductionCompany = async (
  seriesname: string,
  comapnyname: string
) => {
  try {
    const series = await searchSeriesTeam.findSeriesByName(seriesname);
    if (!series) {
      return {
        success: false,
        message: 'No series Found',
      };
    }
    const company = await searchSeriesTeam.findComanyByName(comapnyname);
    if (!company) {
      return {
        success: false,
        message: 'No Production company found',
      };
    }
    const seriesId = Number(series?.id);
    const companyId = Number(company?.id);
    const register = await seriesTeamModalCreate.registerSeriesProductionCompany({
      seriesId,
      companyId,
    });
    if (!register) {
      return {
        success: false,
        message: 'Failed to register the production company for series',
      };
    }
    return {
      success: true,
      message: 'Production comapny of the series added',
    };
  } catch (err) {
    return {
      success: false,
      message: 'Unexpected Error:Failed to add the series production company',
    };
  }
};
const registerPerson = async (data: TPersonCreate) => {
  try {
    const register = await seriesTeamModalCreate.registerSeriesPerson(data);
    if (!register) {
      return {
        success: false,
        message: 'Failed to register the person ',
      };
    }
    return {
      success: true,
      message: 'Person register successfully',
    };
  } catch (err) {
    return {
      success: false,
      message: 'Unexpected error :Failed to register the person',
    };
  }
};
const registerCrewMember = async (
  personName: string,
  seriesName: string,
  department: string,
  job: string
) => {
  try {
    const series = await searchSeriesTeam.findSeriesByName(seriesName);
    if (!series) {
      return {
        success: false,
        message: 'No series found',
      };
    }
    const seriesId = Number(series.id);
    const person = await searchSeriesTeam.findPersonByName(personName);
    if (!person) {
      return {
        success: false,
        message: 'No person was found',
      };
    }
    const personId = Number(person.id);
    const data = { seriesId, personId, department, job };
    const register = await seriesTeamModalCreate.registerCrewMember(data);
    if (!register) {
      return {
        success: false,
        message: 'Failed to register the crew member',
      };
    }
    return {
      success: true,
      message: 'Crew member registerd successfully',
    };
  } catch (err) {
    return {
      success: false,
      message: 'Unexpected Error: Failed to register the crew member',
    };
  }
};
const registerCastMember = async (
  seriesName: string,
  personName: string,
  character: string,
  creditId: string
) => {
  try {
    const series = await searchSeriesTeam.findSeriesByName(seriesName);
    if (!series) {
      return {
        success: false,
        message: 'No series found',
      };
    }
    const seriesId = Number(series.id);
    const person = await searchSeriesTeam.findPersonByName(personName);
    if (!person) {
      return {
        success: false,
        message: 'No person was found',
      };
    }
    const personId = Number(person.id);
    const data = { seriesId, personId, character, creditId };
    const register = await seriesTeamModalCreate.registerCastMember(data);
    if (!register) {
      return {
        success: false,
        message: 'Failed to register the cast member',
      };
    }
    return {
      success: true,
      message: 'Cast member register successfully',
    };
  } catch (err) {
    return {
      success: false,
      message: 'Unexpected Error:Failed to register the cast member',
    };
  }
};
export const seriesTeamRegister = {
  registerProductionCompany,
  registerSeriesProductionCompany,
  registerPerson,
  registerCrewMember,
  registerCastMember,
};
const updateProductionComany = async (
  data: TSeriesTeamProductionCompanyUpdate
) => {
  try {
    const update = await seriesTeamModalUpdate.updateProductionComany(
      data.id,
      data.logoPath,
      data.name,
      data.originCountry
    );
    if (!update) {
      return {
        success: false,
        message: 'Failed to update the production company data',
      };
    }
    return {
      success: true,
      message: 'Production company data updated',
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
};
const updateSeriesProductionComapny = async (
  id: number,
  companyId?: number,
  seriesId?: number
) => {
  try {
    const update = await seriesTeamModalUpdate.updateSeriesProductionComapny(
      id,
      companyId,
      seriesId
    );
    if (!update) {
      return {
        success: false,
        message: 'Failed to update the series productioin company',
      };
    }
    return {
      success: true,
      message: 'Updated the series production company data',
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
};
const updateSeriesPerson = async (
  id: number,
  adult?: boolean,
  birthPlace?: string,
  name?: string,
  deathDay?: Date,
  birthDay?: Date,
  socialPath?: string
) => {
  try {
    const update = await seriesTeamModalUpdate.updateSeriesPerson(
      id,
      adult,
      birthPlace,
      name,
      deathDay,
      birthDay,
      socialPath
    );
    if (!update) {
      return {
        success: false,
        message: 'Failed to update the person data',
      };
    }
    return {
      success: false,
      message: 'Person data updated',
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
};
const updateCrewMember = async (
  id: number,
  department?: string,
  job?: string,
  personId?: number,
  seriesId?: number
) => {
  try {
    const update = await seriesTeamModalUpdate.updateCrewMember(
      id,
      department,
      job,
      personId,
      seriesId
    );
    if (!update) {
      return {
        success: false,
        message: 'Failed to update the crew member',
      };
    }
    return {
      success: true,
      message: 'Crew member data updated',
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
};
const updateCastMember = async (
  id: number,
  character?: string,
  creditId?: string,
  seriesId?: number,
  personId?: number
) => {
  try {
    const update = await seriesTeamModalUpdate.updateCastMember(
      id,
      character,
      creditId,
      seriesId,
      personId
    );
    if (!update) {
      return {
        success: false,
        message: 'Failed to update the cast member data',
      };
    }
    return {
      success: true,
      message: 'Update the cast member data ',
    };
  } catch (err) {
    return {
      success: true,
      message: err,
    };
  }
};
export const seriesTeamServiceUpdate = {
  updateCastMember,
  updateCrewMember,
  updateSeriesPerson,
  updateSeriesProductionComapny,
  updateProductionComany,
};
const deleteProductionCompany = async (id: number) => {
  try {
    const del = await seriesTeamModalDelete.deleteProductionCompany(id);
    if (!del) {
      return {
        success: false,
        message: 'Failed to delete the production company',
      };
    }
    return {
      success: true,
      message: 'Production company deleted',
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
};
const deleteSeriesProductionCompany = async (id: number) => {
  try {
    const del = await seriesTeamModalDelete.deleteSeriesProductionCompany(id);
    if (!del) {
      return {
        success: false,
        message: 'Failed to delete the production company',
      };
    }
    return {
      success: true,
      message: 'Production company deleted',
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
};
const deleteSeriesPerson = async (id: number) => {
  try {
    const del = await seriesTeamModalDelete.deleteSeriesPerson(id);
    if (!del) {
      return {
        success: false,
        message: 'Failed to delete the production company',
      };
    }
    return {
      success: true,
      message: 'Production company deleted',
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
};
const deleteCastMember = async (id: number) => {
  try {
    const del = await seriesTeamModalDelete.deleteCastMember(id);
    if (!del) {
      return {
        success: false,
        message: 'Failed to delete the production company',
      };
    }
    return {
      success: true,
      message: 'Production company deleted',
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
};
const deleteCrewMember = async (id: number) => {
  try {
    const del = await seriesTeamModalDelete.deleteCrewMember(id);
    if (!del) {
      return {
        success: false,
        message: 'Failed to delete the production company',
      };
    }
    return {
      success: true,
      message: 'Production company deleted',
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
};
export const seriesTeamServiceDelete = {
  deleteCastMember,
  deleteCrewMember,
  deleteSeriesPerson,
  deleteSeriesProductionCompany,
  deleteProductionCompany,
};
const getAllProductionCopany = async () => {
  try {
    const data = await seriesTeamModalGet.getAllSeriesProductionCompany();
    if (!data) {
      return {
        success: false,
        message: 'Failed to fetch the data ',
      };
    }
    return {
      success: true,
      message: 'All production company',
      data: data,
    };
  } catch (err) {
    return {
      success: true,
      message: err,
    };
  }
};
const getAllSeriesProductionCopany = async () => {
  try {
    const data = await seriesTeamModalGet.getAllSeriesProductionCompany();
    if (!data) {
      return {
        success: false,
        message: 'Failed to fetch the data ',
      };
    }
    return {
      success: true,
      message: 'All series production company',
      data: data,
    };
  } catch (err) {
    return {
      success: true,
      message: err,
    };
  }
};
const getAllCastMember = async () => {
  try {
    const data = await seriesTeamModalGet.getAllCastMember();
    if (!data) {
      return {
        success: false,
        message: 'Failed to fetch the data ',
      };
    }
    return {
      success: true,
      message: 'All series production company',
      data: data,
    };
  } catch (err) {
    return {
      success: true,
      message: err,
    };
  }
};
const getAllCrewMember = async () => {
  try {
    const data = await seriesTeamModalGet.getAllCrewMember();
    if (!data) {
      return {
        success: false,
        message: 'Failed to fetch the data ',
      };
    }
    return {
      success: true,
      message: 'All series production company',
      data: data,
    };
  } catch (err) {
    return {
      success: true,
      message: err,
    };
  }
};
const getAllSeriesPerson = async () => {
  try {
    const data = await seriesTeamModalGet.getAllSeriesPerson();
    if (!data) {
      return {
        success: false,
        message: 'Failed to fetch the data ',
      };
    }
    return {
      success: true,
      message: 'All series production company',
      data: data,
    };
  } catch (err) {
    return {
      success: true,
      message: err,
    };
  }
};
export const seriesTeamServiceGet = {
  getAllCastMember,
  getAllCrewMember,
  getAllSeriesPerson,
  getAllSeriesProductionCopany,
  getAllProductionCopany,
};
