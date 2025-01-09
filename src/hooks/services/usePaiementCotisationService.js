import {useMutation, useQuery} from "react-query";
import axiosServices from "../../utils/axios";
import {useSelector} from "../../store";

export const usePaiementCotisationService = ()=>
{
    const {selectedAdhesionId, montantVersement, currentCotisation, modePaiementCode} = useSelector(state=>state.paiementCotisation);
    const getEditDTO={montant: montantVersement, typePaiementCode: "PAIE-COT",
        adhesionId: selectedAdhesionId, cotisationId: currentCotisation?.cotisationId, modePaiementCode: modePaiementCode}

    const createVersementCotisation = useMutation(["createVersementCotisation"],
        (dto)=>axiosServices({url: `/paiements/create-versement-cotisation`, method: 'post', data: dto}),
        );
    const createVersementCotisationWithDocuments = useMutation(["createVersementCotisationWithDocuments"],
        (dto)=>axiosServices({url: `/paiements/create`, method: 'post', data: dto, headers: {"Content-Type": "multipart/form-data"}}),
    );

    const getPaiementCotisationDto = useQuery(["getPaiementCotisationDto", montantVersement, currentCotisation],
        ()=>axiosServices({url: `/paiements/get-paiement-cotisation-dto`, method: 'post', data:  getEditDTO}),
        {refetchOnWindowFocus: false, keepPreviousData: true, retry: false}
        );

    const generateRecuPaiementCotisation = useMutation(['generateRecuPaiementCotisation'], (versementId)=>axiosServices({url: `paiements/generate-recu-paiement/${versementId}`, method: 'get'}))

    return {getPaiementCotisationDto, createVersementCotisation, createVersementCotisationWithDocuments, generateRecuPaiementCotisation};
}