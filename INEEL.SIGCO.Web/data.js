var dbData = [
    {
        TableName: "[CH].[AdjuntoBecarioExterno]", Description: ""
        , Coumns: [
            { Name: "AdjuntoBecarioExternoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "N", Description: "" }
            , { Name: "BecarioExternoId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.AdjuntoBecarioExterno_CH.BecarioExterno_BecarioExternoId", Column: "BecarioExternoId", ReferenceTo: "[tab_BecarioExterno].[BecarioExternoId]" }
            , { Name: "FK_CH.AdjuntoBecarioExterno_GEN.Adjunto_AdjuntoId", Column: "AdjuntoId", ReferenceTo: "[Adjunto].[AdjuntoId]" }
        ]
        , Indexes: [
            { Name: "IX_AdjuntoId", Type: "Nonclustered", Columns: ["AdjuntoId"] }
            , { Name: "IX_BecarioExternoId", Type: "Nonclustered", Columns: ["BecarioExternoId"] }
            , { Name: "PK_CH.AdjuntoBecarioExterno", Type: "Clustered", Columns: ["AdjuntoBecarioExternoId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_Ambito]", Description: ""
        , Coumns: [
            { Name: "AmbitoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaEfectiva", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "DescripcionCorta", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "estado", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CH.cat_Ambito", Type: "Clustered", Columns: ["AmbitoId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_AreaSNI]", Description: ""
        , Coumns: [
            { Name: "AreaSNIId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "fechaEfectiva", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "descripcion", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "descripcionCorta", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "estado", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CH.cat_AreaSNI", Type: "Clustered", Columns: ["AreaSNIId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_Asistentes]", Description: ""
        , Coumns: [
            { Name: "AsistenteId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaEfectiva", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "FechaFinNombramiento", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "ClaveUnidad", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "FechaEfectivaNombramiento", Datatype: "DATETIME", Nullable: "N", Description: "" }
        ]
        , DefaultConstraints: [
            { Name: "DF__cat_Asist__Fecha__29B719D8", Column: "FechaEfectivaNombramiento", Value: "('1900-01-01T00:00:00.000')" }
        ]
        , Indexes: [
            { Name: "PK_CH.cat_Asistentes", Type: "Clustered", Columns: ["AsistenteId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_Asociacion]", Description: ""
        , Coumns: [
            { Name: "AsociacionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaEfectiva", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "DescripcionCorta", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "Y", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CH.cat_Asociacion", Type: "Clustered", Columns: ["AsociacionId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_BecasInternas]", Description: ""
        , Coumns: [
            { Name: "BecaInternaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaEfectiva", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "DescripcionCorta", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CH.cat_BecasInternas", Type: "Clustered", Columns: ["BecaInternaId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_CalificacionCompetencias]", Description: ""
        , Coumns: [
            { Name: "CalificacionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "calificacion", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "estado", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CH.cat_CalificacionCompetencias", Type: "Clustered", Columns: ["CalificacionId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_CalificacionnSind]", Description: ""
        , Coumns: [
            { Name: "id", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "descripcion", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "estado", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CH.cat_CalificacionnSind", Type: "Clustered", Columns: ["id"] }
        ]
    }
    , {
        TableName: "[CH].[cat_Campos]", Description: ""
        , Coumns: [
            { Name: "CampoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaEfectiva", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "DescripcionCorta", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CH.cat_Campos", Type: "Clustered", Columns: ["CampoId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_Carreras]", Description: ""
        , Coumns: [
            { Name: "CarreraId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaEfectiva", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "DescripcionCorta", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "DisciplinaId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.cat_Carreras_CH.cat_Disciplinas_DisciplinaId", Column: "DisciplinaId", ReferenceTo: "[cat_Disciplinas].[DisciplinaId]" }
        ]
        , Indexes: [
            { Name: "IX_DisciplinaId", Type: "Nonclustered", Columns: ["DisciplinaId"] }
            , { Name: "PK_CH.cat_Carreras", Type: "Clustered", Columns: ["CarreraId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_CategoriasCompetenciasSind]", Description: ""
        , Coumns: [
            { Name: "CategoriaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NombreCategoria", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "Periodo", Datatype: "NVARCHAR(8)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FamiliaId", Datatype: "INT", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.cat_CategoriasCompetenciasSind_CH.cat_FamiliaPuestosSind_FamiliaId", Column: "FamiliaId", ReferenceTo: "[cat_FamiliaPuestosSind].[FamiliaId]" }
        ]
        , Indexes: [
            { Name: "IX_FamiliaId", Type: "Nonclustered", Columns: ["FamiliaId"] }
            , { Name: "PK_CH.cat_CategoriasCompetenciasSind", Type: "Clustered", Columns: ["CategoriaId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_CategoriasPorFamilia]", Description: ""
        , Coumns: [
            { Name: "CategoriaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NombreCategoria", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "Periodo", Datatype: "NVARCHAR(8)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FamiliaId", Datatype: "INT", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.cat_CategoriasPorFamilia_CH.tab_FamiliaPuestos_FamiliaId", Column: "FamiliaId", ReferenceTo: "[tab_FamiliaPuestos].[FamiliaId]" }
        ]
        , Indexes: [
            { Name: "IX_FamiliaId", Type: "Nonclustered", Columns: ["FamiliaId"] }
            , { Name: "PK_CH.cat_CategoriasPorFamilia", Type: "Clustered", Columns: ["CategoriaId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_Certificacion]", Description: ""
        , Coumns: [
            { Name: "CertificacionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaEfectiva", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "DescripcionCorta", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "IdiomaId", Datatype: "INT", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.cat_Certificacion_CH.cat_Idioma_IdiomaId", Column: "IdiomaId", ReferenceTo: "[cat_Idioma].[IdiomaId]" }
        ]
        , Indexes: [
            { Name: "IX_IdiomaId", Type: "Nonclustered", Columns: ["IdiomaId"] }
            , { Name: "PK_CH.cat_Certificacion", Type: "Clustered", Columns: ["CertificacionId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_ClasificacionAreas]", Description: ""
        , Coumns: [
            { Name: "id", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "area", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "nombreArea", Datatype: "NVARCHAR(500)", Nullable: "Y", Description: "" }
            , { Name: "periodoId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "TipoAreaId", Datatype: "INT", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.cat_ClasificacionAreas_CH.cat_PeriodoEvaluacion_periodoId", Column: "periodoId", ReferenceTo: "[cat_PeriodoEvaluacion].[PeriodoEvaluaionId]" }
            , { Name: "FK_CH.cat_ClasificacionAreas_CH.cat_TipoArea_TipoAreaId", Column: "TipoAreaId", ReferenceTo: "[cat_TipoArea].[TipoAreaId]" }
        ]
        , Indexes: [
            { Name: "IX_periodoId", Type: "Nonclustered", Columns: ["periodoId"] }
            , { Name: "IX_TipoAreaId", Type: "Nonclustered", Columns: ["TipoAreaId"] }
            , { Name: "PK_CH.cat_ClasificacionAreas", Type: "Clustered", Columns: ["id"] }
        ]
    }
    , {
        TableName: "[CH].[cat_CompetenciasSind]", Description: ""
        , Coumns: [
            { Name: "CompetenciaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Competencia", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(1200)", Nullable: "Y", Description: "" }
            , { Name: "periodoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.cat_CompetenciasSind_CH.cat_PeriodoEvaluacion_periodoId", Column: "periodoId", ReferenceTo: "[cat_PeriodoEvaluacion].[PeriodoEvaluaionId]" }
        ]
        , Indexes: [
            { Name: "IX_periodoId", Type: "Nonclustered", Columns: ["periodoId"] }
            , { Name: "PK_CH.cat_CompetenciasSind", Type: "Clustered", Columns: ["CompetenciaId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_CompetenciasTecnicas]", Description: ""
        , Coumns: [
            { Name: "CompetenciaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Competencia", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "periodoId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "areaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "nivelId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.cat_CompetenciasTecnicas_CH.cat_NivelCompetenciaTecnica_nivelId", Column: "nivelId", ReferenceTo: "[cat_NivelCompetenciaTecnica].[NivelCompetenciaId]" }
            , { Name: "FK_CH.cat_CompetenciasTecnicas_CH.cat_PeriodoEvaluacion_periodoId", Column: "periodoId", ReferenceTo: "[cat_PeriodoEvaluacion].[PeriodoEvaluaionId]" }
            , { Name: "FK_CH.cat_CompetenciasTecnicas_CH.cat_TipoArea_areaId", Column: "areaId", ReferenceTo: "[cat_TipoArea].[TipoAreaId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__cat_Compe__nivel__10B661E4", Column: "nivelId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_areaId", Type: "Nonclustered", Columns: ["areaId"] }
            , { Name: "IX_nivelId", Type: "Nonclustered", Columns: ["nivelId"] }
            , { Name: "IX_periodoId", Type: "Nonclustered", Columns: ["periodoId"] }
            , { Name: "PK_CH.cat_CompetenciasTecnicas", Type: "Clustered", Columns: ["CompetenciaId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_ComportamientosSind]", Description: ""
        , Coumns: [
            { Name: "id", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "descripcion", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "estado", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CH.cat_ComportamientosSind", Type: "Clustered", Columns: ["id"] }
        ]
    }
    , {
        TableName: "[CH].[cat_Congresos]", Description: ""
        , Coumns: [
            { Name: "CongresoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaEfectiva", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NombreCongreso", Datatype: "NVARCHAR(600)", Nullable: "Y", Description: "" }
            , { Name: "numero", Datatype: "NVARCHAR(60)", Nullable: "Y", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CH.cat_Congresos", Type: "Clustered", Columns: ["CongresoId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_DescripcionComportamiento]", Description: ""
        , Coumns: [
            { Name: "DescComportamientoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Periodo", Datatype: "NVARCHAR(8)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "CompetenciaID", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "NivelId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "nivel_NivelCompetenciaId", Datatype: "INT", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.cat_DescripcionComportamiento_CH.cat_NivelesCompetencias_nivel_NivelCompetenciaId", Column: "nivel_NivelCompetenciaId", ReferenceTo: "[cat_NivelesCompetencias].[NivelCompetenciaId]" }
            , { Name: "FK_CH.cat_DescripcionComportamiento_CH.tab_Competencias_CompetenciaID", Column: "CompetenciaID", ReferenceTo: "[tab_Competencias].[CompetenciaId]" }
        ]
        , Indexes: [
            { Name: "IX_CompetenciaID", Type: "Nonclustered", Columns: ["CompetenciaID"] }
            , { Name: "IX_nivel_NivelCompetenciaId", Type: "Nonclustered", Columns: ["nivel_NivelCompetenciaId"] }
            , { Name: "PK_CH.cat_DescripcionComportamiento", Type: "Clustered", Columns: ["DescComportamientoId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_DescripcionNiveles]", Description: ""
        , Coumns: [
            { Name: "descNivelId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Periodo", Datatype: "NVARCHAR(8)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "CompetenciaID", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "NivelId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "Comportamiento", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.cat_DescripcionNiveles_CH.cat_NivelesCompetencias_nivel_NivelCompetenciaId", Column: "NivelId", ReferenceTo: "[cat_NivelesCompetencias].[NivelCompetenciaId]" }
            , { Name: "FK_CH.cat_DescripcionNiveles_CH.tab_Competencias_CompetenciaID", Column: "CompetenciaID", ReferenceTo: "[tab_Competencias].[CompetenciaId]" }
        ]
        , Indexes: [
            { Name: "IX_CompetenciaID", Type: "Nonclustered", Columns: ["CompetenciaID"] }
            , { Name: "IX_NivelId", Type: "Nonclustered", Columns: ["NivelId"] }
            , { Name: "PK_CH.cat_DescripcionNiveles", Type: "Clustered", Columns: ["descNivelId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_Disciplinas]", Description: ""
        , Coumns: [
            { Name: "DisciplinaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaEfectiva", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "DescripcionCorta", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "CampoId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.cat_Disciplinas_CH.cat_Campos_CampoId", Column: "CampoId", ReferenceTo: "[cat_Campos].[CampoId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__cat_Disci__Campo__08162EEB", Column: "CampoId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_CampoId", Type: "Nonclustered", Columns: ["CampoId"] }
            , { Name: "PK_CH.cat_Disciplinas", Type: "Clustered", Columns: ["DisciplinaId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_EncargadoDespacho]", Description: ""
        , Coumns: [
            { Name: "ClaveUnidad", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "FechaEfectiva", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "EncargadoDespachoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "FechaEfectivaNombramiento", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "FechaFinNombramiento", Datatype: "DATETIME", Nullable: "Y", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CH.cat_EncargadoDespacho", Type: "Clustered", Columns: ["EncargadoDespachoId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_EstadoAcademico]", Description: ""
        , Coumns: [
            { Name: "EstadoAcademicoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaEfectiva", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "DescripcionCorta", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "Y", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CH.cat_EstadoAcademico", Type: "Clustered", Columns: ["EstadoAcademicoId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_EstadoEvaluacion]", Description: ""
        , Coumns: [
            { Name: "EstadoEvaluacionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CH.cat_EstadoEvaluacion", Type: "Clustered", Columns: ["EstadoEvaluacionId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_EstadoEvaluacionSind]", Description: ""
        , Coumns: [
            { Name: "id", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "descripcion", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "estado", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CH.cat_EstadoEvaluacionSind", Type: "Clustered", Columns: ["id"] }
        ]
    }
    , {
        TableName: "[CH].[cat_EstadoPonencia]", Description: ""
        , Coumns: [
            { Name: "EstadoPonenciaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaEfectiva", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "DescripcionCorta", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CH.cat_EstadoPonencia", Type: "Clustered", Columns: ["EstadoPonenciaId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_EstadosPublicacion]", Description: ""
        , Coumns: [
            { Name: "EstadoPublicacionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaEfectiva", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "DescripcionCorta", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CH.cat_EstadosPublicacion", Type: "Clustered", Columns: ["EstadoPublicacionId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_Eventos]", Description: ""
        , Coumns: [
            { Name: "EventoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaEfectiva", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "DescripcionCorta", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CH.cat_Eventos", Type: "Clustered", Columns: ["EventoId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_ExperienciaPrevia]", Description: ""
        , Coumns: [
            { Name: "ClaveEmpleado", Datatype: "NVARCHAR(256)", Nullable: "N", Description: "" }
            , { Name: "Fecha", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "DuracionPuesto", Datatype: "REAL", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CH.cat_ExperienciaPrevia", Type: "Clustered", Columns: ["ClaveEmpleado"] }
        ]
    }
    , {
        TableName: "[CH].[cat_FamiliaPuestosSind]", Description: ""
        , Coumns: [
            { Name: "FamiliaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NombreFamilia", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "periodoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "estado", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.cat_FamiliaPuestosSind_CH.cat_PeriodoEvaluacion_periodoId", Column: "periodoId", ReferenceTo: "[cat_PeriodoEvaluacion].[PeriodoEvaluaionId]" }
        ]
        , Indexes: [
            { Name: "IX_periodoId", Type: "Nonclustered", Columns: ["periodoId"] }
            , { Name: "PK_CH.cat_FamiliaPuestosSind", Type: "Clustered", Columns: ["FamiliaId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_GradoAcademico]", Description: ""
        , Coumns: [
            { Name: "GradoAcademicoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaEfectiva", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "DescripcionCorta", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "Y", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CH.cat_GradoAcademico", Type: "Clustered", Columns: ["GradoAcademicoId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_Idioma]", Description: ""
        , Coumns: [
            { Name: "IdiomaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaEfectiva", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "DescripcionCorta", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "Y", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CH.cat_Idioma", Type: "Clustered", Columns: ["IdiomaId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_Instituciones]", Description: ""
        , Coumns: [
            { Name: "InstitucionID", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaEfectiva", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "DescripcionCorta", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "PaisID", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.cat_Instituciones_CH.cat_Pais_PaisID", Column: "PaisID", ReferenceTo: "[cat_Pais].[PaisID]" }
        ]
        , Indexes: [
            { Name: "IX_PaisID", Type: "Nonclustered", Columns: ["PaisID"] }
            , { Name: "PK_CH.cat_Instituciones", Type: "Clustered", Columns: ["InstitucionID"] }
        ]
    }
    , {
        TableName: "[CH].[cat_MatrizCompetenciasSind]", Description: ""
        , Coumns: [
            { Name: "id", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "idCategoria", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "idRelacionCompetencias", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "estado", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.cat_MatrizCompetenciasSind_CH.cat_CategoriasCompetenciasSind_idCategoria", Column: "idCategoria", ReferenceTo: "[cat_CategoriasCompetenciasSind].[CategoriaId]" }
            , { Name: "FK_CH.cat_MatrizCompetenciasSind_CH.cat_RelacionCompetenciasNivelSind_idRelacionCompetencias", Column: "idRelacionCompetencias", ReferenceTo: "[cat_RelacionCompetenciasNivelSind].[id]" }
        ]
        , Indexes: [
            { Name: "IX_idCategoria", Type: "Nonclustered", Columns: ["idCategoria"] }
            , { Name: "IX_idRelacionCompetencias", Type: "Nonclustered", Columns: ["idRelacionCompetencias"] }
            , { Name: "PK_CH.cat_MatrizCompetenciasSind", Type: "Clustered", Columns: ["id"] }
        ]
    }
    , {
        TableName: "[CH].[cat_NivelCompetenciaTecnica]", Description: ""
        , Coumns: [
            { Name: "NivelCompetenciaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "categoriaMin", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "categoraMax", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "nivelMin", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "nivelMax", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "periodoId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "areaId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.cat_NivelCompetenciaTecnica_CH.cat_PeriodoEvaluacion_periodoId", Column: "periodoId", ReferenceTo: "[cat_PeriodoEvaluacion].[PeriodoEvaluaionId]" }
            , { Name: "FK_CH.cat_NivelCompetenciaTecnica_CH.cat_TipoArea_areaId", Column: "areaId", ReferenceTo: "[cat_TipoArea].[TipoAreaId]" }
        ]
        , Indexes: [
            { Name: "IX_areaId", Type: "Nonclustered", Columns: ["areaId"] }
            , { Name: "IX_periodoId", Type: "Nonclustered", Columns: ["periodoId"] }
            , { Name: "PK_CH.cat_NivelCompetenciaTecnica", Type: "Clustered", Columns: ["NivelCompetenciaId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_NivelCurso]", Description: ""
        , Coumns: [
            { Name: "NivelCursoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaEfectiva", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "DescripcionCorta", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CH.cat_NivelCurso", Type: "Clustered", Columns: ["NivelCursoId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_NivelesCompetencias]", Description: ""
        , Coumns: [
            { Name: "NivelCompetenciaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CH.cat_NivelesCompetencias", Type: "Clustered", Columns: ["NivelCompetenciaId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_NivelPublicacion]", Description: ""
        , Coumns: [
            { Name: "NivelPublicacionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaEfectiva", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "DescripcionCorta", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CH.cat_NivelPublicacion", Type: "Clustered", Columns: ["NivelPublicacionId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_NivelSNI]", Description: ""
        , Coumns: [
            { Name: "NivelSNIId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "fechaEfectiva", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "descripcion", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "descripcionCorta", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CH.cat_NivelSNI", Type: "Clustered", Columns: ["NivelSNIId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_NominaCompetencias]", Description: ""
        , Coumns: [
            { Name: "RelacionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClaveCategoria", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "categoriaEmpleado", Datatype: "NVARCHAR(360)", Nullable: "Y", Description: "" }
            , { Name: "categoriaCompetencia", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "categoriaServicio", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "nombreCategoriaServicio", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "periodoId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FamiliaId", Datatype: "INT", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.cat_NominaCompetencias_CH.cat_CategoriasPorFamilia_categoriaCompetencia", Column: "categoriaCompetencia", ReferenceTo: "[cat_CategoriasPorFamilia].[CategoriaId]" }
            , { Name: "FK_CH.cat_NominaCompetencias_CH.cat_PeriodoEvaluacion_periodoId", Column: "periodoId", ReferenceTo: "[cat_PeriodoEvaluacion].[PeriodoEvaluaionId]" }
            , { Name: "FK_CH.cat_NominaCompetencias_CH.tab_FamiliaPuestos_FamiliaId", Column: "FamiliaId", ReferenceTo: "[tab_FamiliaPuestos].[FamiliaId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__cat_Nomin__Estad__41E3A924", Column: "Estado", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_categoriaCompetencia", Type: "Nonclustered", Columns: ["categoriaCompetencia"] }
            , { Name: "IX_FamiliaId", Type: "Nonclustered", Columns: ["FamiliaId"] }
            , { Name: "IX_periodoId", Type: "Nonclustered", Columns: ["periodoId"] }
            , { Name: "PK_CH.cat_NominaCompetencias", Type: "Clustered", Columns: ["RelacionId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_Pais]", Description: ""
        , Coumns: [
            { Name: "PaisID", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaEfectiva", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "DescripcionCorta", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CH.cat_Pais", Type: "Clustered", Columns: ["PaisID"] }
        ]
    }
    , {
        TableName: "[CH].[cat_PeriodoEvaluacion]", Description: ""
        , Coumns: [
            { Name: "PeriodoEvaluaionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Periodo", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "PersonalMigrado", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "EvaluacionFinalizada", Datatype: "INT", Nullable: "Y", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CH.cat_PeriodoEvaluacion", Type: "Clustered", Columns: ["PeriodoEvaluaionId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_RegistroEvaluacionesSind]", Description: ""
        , Coumns: [
            { Name: "id", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "idEvaluacionSin", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "idMatriz", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "valorEsperado", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "valorReal", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "justificacion", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.cat_RegistroEvaluacionesSind_CH.cat_MatrizCompetenciasSind_idMatriz", Column: "idMatriz", ReferenceTo: "[cat_MatrizCompetenciasSind].[id]" }
        ]
        , Indexes: [
            { Name: "IX_idMatriz", Type: "Nonclustered", Columns: ["idMatriz"] }
            , { Name: "PK_CH.cat_RegistroEvaluacionesSind", Type: "Clustered", Columns: ["id"] }
        ]
    }
    , {
        TableName: "[CH].[cat_RelacionCategoriasTecnicas]", Description: ""
        , Coumns: [
            { Name: "Id", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClaveCategoria", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "categoriaEmpleado", Datatype: "NVARCHAR(360)", Nullable: "Y", Description: "" }
            , { Name: "periodoId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "nivelId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "areaId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.cat_RelacionCategoriasTecnicas_CH.cat_NivelCompetenciaTecnica_nivelId", Column: "nivelId", ReferenceTo: "[cat_NivelCompetenciaTecnica].[NivelCompetenciaId]" }
            , { Name: "FK_CH.cat_RelacionCategoriasTecnicas_CH.cat_PeriodoEvaluacion_periodoId", Column: "periodoId", ReferenceTo: "[cat_PeriodoEvaluacion].[PeriodoEvaluaionId]" }
            , { Name: "FK_CH.cat_RelacionCategoriasTecnicas_CH.cat_TipoArea_areaId", Column: "areaId", ReferenceTo: "[cat_TipoArea].[TipoAreaId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__cat_Relac__areaI__5125ECB4", Column: "areaId", Value: "((0))" }
            , { Name: "DF__cat_Relac__nivel__5031C87B", Column: "nivelId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_areaId", Type: "Nonclustered", Columns: ["areaId"] }
            , { Name: "IX_nivelId", Type: "Nonclustered", Columns: ["nivelId"] }
            , { Name: "IX_periodoId", Type: "Nonclustered", Columns: ["periodoId"] }
            , { Name: "PK_CH.cat_RelacionCategoriasTecnicas", Type: "Clustered", Columns: ["Id"] }
        ]
    }
    , {
        TableName: "[CH].[cat_RelacionCompetenciasNivelSind]", Description: ""
        , Coumns: [
            { Name: "id", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "idCompetencia", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "idNivel", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "idPeriodo", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "estado", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "idRelacionComportamiento", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.cat_RelacionCompetenciasNivelSind_CH.cat_CompetenciasSind_idCompetencia", Column: "idCompetencia", ReferenceTo: "[cat_CompetenciasSind].[CompetenciaId]" }
            , { Name: "FK_CH.cat_RelacionCompetenciasNivelSind_CH.cat_NivelesCompetencias_idNivel", Column: "idNivel", ReferenceTo: "[cat_NivelesCompetencias].[NivelCompetenciaId]" }
            , { Name: "FK_CH.cat_RelacionCompetenciasNivelSind_CH.cat_PeriodoEvaluacion_idPeriodo", Column: "idPeriodo", ReferenceTo: "[cat_PeriodoEvaluacion].[PeriodoEvaluaionId]" }
            , { Name: "FK_CH.cat_RelacionCompetenciasNivelSind_CH.cat_RelacionNivelesComportamientoSind_idRelacionComportamiento", Column: "idRelacionComportamiento", ReferenceTo: "[cat_RelacionNivelesComportamientoSind].[id]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__cat_Relac__estad__7B1C2680", Column: "estado", Value: "((0))" }
            , { Name: "DF__cat_Relac__idRel__3B01A16B", Column: "idRelacionComportamiento", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_idCompetencia", Type: "Nonclustered", Columns: ["idCompetencia"] }
            , { Name: "IX_idNivel", Type: "Nonclustered", Columns: ["idNivel"] }
            , { Name: "IX_idPeriodo", Type: "Nonclustered", Columns: ["idPeriodo"] }
            , { Name: "IX_idRelacionComportamiento", Type: "Nonclustered", Columns: ["idRelacionComportamiento"] }
            , { Name: "PK_CH.cat_RelacionCompetenciasNivelSind", Type: "Clustered", Columns: ["id"] }
        ]
    }
    , {
        TableName: "[CH].[cat_RelacionNivelesComportamientoSind]", Description: ""
        , Coumns: [
            { Name: "id", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "idNivel", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "idComportamiento", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.cat_RelacionNivelesComportamientoSind_CH.cat_ComportamientosSind_idComportamiento", Column: "idComportamiento", ReferenceTo: "[cat_ComportamientosSind].[id]" }
            , { Name: "FK_CH.cat_RelacionNivelesComportamientoSind_CH.cat_NivelesCompetencias_idNivel", Column: "idNivel", ReferenceTo: "[cat_NivelesCompetencias].[NivelCompetenciaId]" }
        ]
        , Indexes: [
            { Name: "IX_idComportamiento", Type: "Nonclustered", Columns: ["idComportamiento"] }
            , { Name: "IX_idNivel", Type: "Nonclustered", Columns: ["idNivel"] }
            , { Name: "PK_CH.cat_RelacionNivelesComportamientoSind", Type: "Clustered", Columns: ["id"] }
        ]
    }
    , {
        TableName: "[CH].[cat_Revistas]", Description: ""
        , Coumns: [
            { Name: "RevistaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaEfectiva", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "RevistaNombre", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Volumen", Datatype: "NVARCHAR(60)", Nullable: "Y", Description: "" }
            , { Name: "Numero", Datatype: "NVARCHAR(60)", Nullable: "Y", Description: "" }
            , { Name: "ISSN", Datatype: "NVARCHAR(80)", Nullable: "Y", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CH.cat_Revistas", Type: "Clustered", Columns: ["RevistaId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_TipoArea]", Description: ""
        , Coumns: [
            { Name: "TipoAreaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Area", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CH.cat_TipoArea", Type: "Clustered", Columns: ["TipoAreaId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_TipoBecas]", Description: ""
        , Coumns: [
            { Name: "TipoBecaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaEfectiva", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "DescripcionCorta", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CH.cat_TipoBecas", Type: "Clustered", Columns: ["TipoBecaId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_TipoCompetencia]", Description: ""
        , Coumns: [
            { Name: "TipoCompetenciaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NombreCompetencia", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "estado", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CH.cat_TipoCompetencia", Type: "Clustered", Columns: ["TipoCompetenciaId"] }
        ]
    }
    , {
        TableName: "[CH].[cat_TipoInformacion]", Description: ""
        , Coumns: [
            { Name: "TipoInformacionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(300)", Nullable: "Y", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CH.cat_TipoInformacion", Type: "Clustered", Columns: ["TipoInformacionId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_AdjuntoCursos]", Description: ""
        , Coumns: [
            { Name: "AdjuntoCursosId", Datatype: "BIGINT", Nullable: "N", Description: "" }
            , { Name: "RutaCompleta", Datatype: "NVARCHAR(-1)", Nullable: "N", Description: "" }
            , { Name: "nombre", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "ModuloId", Datatype: "NVARCHAR(6)", Nullable: "Y", Description: "" }
            , { Name: "CursoInternoId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_AdjuntoCursos_GEN.cat_Modulo_ModuloId", Column: "ModuloId", ReferenceTo: "[cat_Modulo].[ModuloId]" }
        ]
        , Indexes: [
            { Name: "IX_ModuloId", Type: "Nonclustered", Columns: ["ModuloId"] }
            , { Name: "PK_CH.tab_AdjuntoCursos", Type: "Clustered", Columns: ["AdjuntoCursosId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_AreasMejoraCompetencia]", Description: ""
        , Coumns: [
            { Name: "Id", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "EmpleadoEvaluacionId", Datatype: "INT", Nullable: "Y", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CH.tab_AreasMejoraCompetencia", Type: "Clustered", Columns: ["Id"] }
        ]
    }
    , {
        TableName: "[CH].[tab_Asociaciones]", Description: ""
        , Coumns: [
            { Name: "AsociacionesId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaValidacion", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "EstadoFlujoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Participacion", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "FechaInicio", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "FechaTermino", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "AsociacionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "Y", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_Asociaciones_CH.cat_Asociacion_AsociacionId", Column: "AsociacionId", ReferenceTo: "[cat_Asociacion].[AsociacionId]" }
            , { Name: "FK_CH.tab_Asociaciones_GEN.Adjunto_AdjuntoId", Column: "AdjuntoId", ReferenceTo: "[Adjunto].[AdjuntoId]" }
            , { Name: "FK_CH.tab_Asociaciones_GEN.cat_EstadoFlujo_EstadoFlujoId", Column: "EstadoFlujoId", ReferenceTo: "[cat_EstadoFlujo].[EstadoFlujoId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_Asoci__Asoci__1B29035F", Column: "AsociacionId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_AdjuntoId", Type: "Nonclustered", Columns: ["AdjuntoId"] }
            , { Name: "IX_AsociacionId", Type: "Nonclustered", Columns: ["AsociacionId"] }
            , { Name: "IX_EstadoFlujoId", Type: "Nonclustered", Columns: ["EstadoFlujoId"] }
            , { Name: "PK_CH.tab_Asociaciones", Type: "Clustered", Columns: ["AsociacionesId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_AutorExternoCursoInterno]", Description: ""
        , Coumns: [
            { Name: "AutorExternoCursoInternoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "CursoInternoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NombreCompleto", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Institucion", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_AutorExternoCursoInterno_CH.tab_CursoInterno_CursoInternoId", Column: "CursoInternoId", ReferenceTo: "[tab_CursoInterno].[CursoInternoId]" }
        ]
        , Indexes: [
            { Name: "IX_CursoInternoId", Type: "Nonclustered", Columns: ["CursoInternoId"] }
            , { Name: "PK_CH.tab_AutorExternoCursoInterno", Type: "Clustered", Columns: ["AutorExternoCursoInternoId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_AutorIIEPonencia]", Description: ""
        , Coumns: [
            { Name: "AutorIIEPonenciaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "PonenciaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Contribucion", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_AutorIIEPonencia_CH.tab_Ponencia_PonenciaId", Column: "PonenciaId", ReferenceTo: "[tab_Ponencia].[PonenciaId]" }
        ]
        , Indexes: [
            { Name: "IX_PonenciaId", Type: "Nonclustered", Columns: ["PonenciaId"] }
            , { Name: "PK_CH.tab_AutorIIEPonencia", Type: "Clustered", Columns: ["AutorIIEPonenciaId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_AutorIIEPublicacion]", Description: ""
        , Coumns: [
            { Name: "AutorIIEPublicacionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "PublicacionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Contribucion", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_AutorIIEPublicacion_CH.tab_Publicacion_PublicacionId", Column: "PublicacionId", ReferenceTo: "[tab_Publicacion].[PublicacionId]" }
        ]
        , Indexes: [
            { Name: "IX_PublicacionId", Type: "Nonclustered", Columns: ["PublicacionId"] }
            , { Name: "PK_CH.tab_AutorIIEPublicacion", Type: "Clustered", Columns: ["AutorIIEPublicacionId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_AutorInternoCursoInterno]", Description: ""
        , Coumns: [
            { Name: "AutorInternoCursoInternoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "CursoInternoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_AutorInternoCursoInterno_CH.tab_CursoInterno_CursoInternoId", Column: "CursoInternoId", ReferenceTo: "[tab_CursoInterno].[CursoInternoId]" }
        ]
        , Indexes: [
            { Name: "IX_CursoInternoId", Type: "Nonclustered", Columns: ["CursoInternoId"] }
            , { Name: "PK_CH.tab_AutorInternoCursoInterno", Type: "Clustered", Columns: ["AutorInternoCursoInternoId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_AutorPonenciaExt]", Description: ""
        , Coumns: [
            { Name: "AutorPonenciaExtId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "PonenciaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Institucion", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Contribucion", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_AutorPonenciaExt_CH.tab_Ponencia_PonenciaId", Column: "PonenciaId", ReferenceTo: "[tab_Ponencia].[PonenciaId]" }
        ]
        , Indexes: [
            { Name: "IX_PonenciaId", Type: "Nonclustered", Columns: ["PonenciaId"] }
            , { Name: "PK_CH.tab_AutorPonenciaExt", Type: "Clustered", Columns: ["AutorPonenciaExtId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_AutorPublicacionExt]", Description: ""
        , Coumns: [
            { Name: "AutorPublicacionExtId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "PublicacionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Institucion", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Contribucion", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_AutorPublicacionExt_CH.tab_Publicacion_PublicacionId", Column: "PublicacionId", ReferenceTo: "[tab_Publicacion].[PublicacionId]" }
        ]
        , Indexes: [
            { Name: "IX_PublicacionId", Type: "Nonclustered", Columns: ["PublicacionId"] }
            , { Name: "PK_CH.tab_AutorPublicacionExt", Type: "Clustered", Columns: ["AutorPublicacionExtId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_BecarioDirigido]", Description: ""
        , Coumns: [
            { Name: "BecarioDirigidoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "FechaValidacion", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "EstadoFlujoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NumeroBecario", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "NombreBecario", Datatype: "NVARCHAR(300)", Nullable: "Y", Description: "" }
            , { Name: "TipoBecaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "OtorganteBeca", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "NombreEstancia", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "ProyectoId", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "FechaInicio", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "FechaTermino", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "Y", Description: "" }
            , { Name: "ClaveUnidad", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "FechaEfectiva", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "TesisDirigidaId", Datatype: "INT", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_BecarioDirigido_CH.cat_TipoBecas_TipoBecaId", Column: "TipoBecaId", ReferenceTo: "[cat_TipoBecas].[TipoBecaId]" }
            , { Name: "FK_CH.tab_BecarioDirigido_GEN.Adjunto_AdjuntoId", Column: "AdjuntoId", ReferenceTo: "[Adjunto].[AdjuntoId]" }
            , { Name: "FK_CH.tab_BecarioDirigido_GEN.cat_EstadoFlujo_EstadoFlujoId", Column: "EstadoFlujoId", ReferenceTo: "[cat_EstadoFlujo].[EstadoFlujoId]" }
            , { Name: "FK_CH.tab_BecarioDirigido_GEN.cat_UnidadOrganizacional_UnidadOrganizacional_ClaveUnidad_UnidadOrganizacional_FechaEfectiva", Column: "ClaveUnidad", ReferenceTo: "[cat_UnidadOrganizacional].[ClaveUnidad]" }
            , { Name: "FK_CH.tab_BecarioDirigido_GEN.cat_UnidadOrganizacional_UnidadOrganizacional_ClaveUnidad_UnidadOrganizacional_FechaEfectiva", Column: "FechaEfectiva", ReferenceTo: "[cat_UnidadOrganizacional].[FechaEfectiva]" }
            , { Name: "FK_CH.tab_BecarioDirigido_GEN.Proyectos_ProyectoId", Column: "ProyectoId", ReferenceTo: "[Proyectos].[ProyectoId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_Becar__Tesis__2FC4F8E9", Column: "TesisDirigidaId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_AdjuntoId", Type: "Nonclustered", Columns: ["AdjuntoId"] }
            , { Name: "IX_EstadoFlujoId", Type: "Nonclustered", Columns: ["EstadoFlujoId"] }
            , { Name: "IX_ProyectoId", Type: "Nonclustered", Columns: ["ProyectoId"] }
            , { Name: "IX_TipoBecaId", Type: "Nonclustered", Columns: ["TipoBecaId"] }
            , { Name: "PK_CH.tab_BecarioDirigido", Type: "Clustered", Columns: ["BecarioDirigidoId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_BecarioExterno]", Description: ""
        , Coumns: [
            { Name: "BecarioExternoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "EstadoFlujoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "TipoBecaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ProyectoId", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "FechaInicio", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "FechaTermino", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "Titulo", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "InstitucionID", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "Asesor_ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Becario_ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "FechaValidacion", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "Becario_Nombre", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Asesor_Nombre", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "EstadoActivoId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.BecarioExterno_CH.cat_Instituciones_InstitucionID", Column: "InstitucionID", ReferenceTo: "[cat_Instituciones].[InstitucionID]" }
            , { Name: "FK_CH.BecarioExterno_CH.cat_TipoBecas_TipoBecaId", Column: "TipoBecaId", ReferenceTo: "[cat_TipoBecas].[TipoBecaId]" }
            , { Name: "FK_CH.BecarioExterno_GEN.Proyectos_ProyectoId", Column: "ProyectoId", ReferenceTo: "[Proyectos].[ProyectoId]" }
            , { Name: "FK_CH.tab_BecarioExterno_CH.cat_Instituciones_InstitucionID", Column: "InstitucionID", ReferenceTo: "[cat_Instituciones].[InstitucionID]" }
            , { Name: "FK_CH.tab_BecarioExterno_GEN.cat_EstadoFlujo_EstadoFlujoId", Column: "EstadoFlujoId", ReferenceTo: "[cat_EstadoFlujo].[EstadoFlujoId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__BecarioEx__Estad__407A839F", Column: "EstadoActivoId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_EstadoFlujoId", Type: "Nonclustered", Columns: ["EstadoFlujoId"] }
            , { Name: "IX_InstitucionID", Type: "Nonclustered", Columns: ["InstitucionID"] }
            , { Name: "IX_ProyectoId", Type: "Nonclustered", Columns: ["ProyectoId"] }
            , { Name: "IX_TipoBecaId", Type: "Nonclustered", Columns: ["TipoBecaId"] }
            , { Name: "PK_CH.BecarioExterno", Type: "Clustered", Columns: ["BecarioExternoId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_BecarioInterno]", Description: ""
        , Coumns: [
            { Name: "BecarioInternoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaValidacion", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "EstadoFlujoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "CarreraId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "InstitucionID", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "PaisID", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaBaja", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "FechaInicioBeca", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "FechaTerminoBeca", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Extencion", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "fechaTerminoExt", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "Y", Description: "" }
            , { Name: "BecaInternaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "BecarioDirigidoId", Datatype: "INT", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_BecarioInterno_CH.cat_BecasInternas_BecaInternaId", Column: "BecaInternaId", ReferenceTo: "[cat_BecasInternas].[BecaInternaId]" }
            , { Name: "FK_CH.tab_BecarioInterno_CH.cat_Carreras_CarreraId", Column: "CarreraId", ReferenceTo: "[cat_Carreras].[CarreraId]" }
            , { Name: "FK_CH.tab_BecarioInterno_CH.cat_Instituciones_InstitucionID", Column: "InstitucionID", ReferenceTo: "[cat_Instituciones].[InstitucionID]" }
            , { Name: "FK_CH.tab_BecarioInterno_CH.cat_Pais_PaisID", Column: "PaisID", ReferenceTo: "[cat_Pais].[PaisID]" }
            , { Name: "FK_CH.tab_BecarioInterno_CH.tab_BecarioDirigido_BecarioDirigidoId", Column: "BecarioDirigidoId", ReferenceTo: "[tab_BecarioDirigido].[BecarioDirigidoId]" }
            , { Name: "FK_CH.tab_BecarioInterno_GEN.Adjunto_AdjuntoId", Column: "AdjuntoId", ReferenceTo: "[Adjunto].[AdjuntoId]" }
            , { Name: "FK_CH.tab_BecarioInterno_GEN.cat_EstadoFlujo_EstadoFlujoId", Column: "EstadoFlujoId", ReferenceTo: "[cat_EstadoFlujo].[EstadoFlujoId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_Becar__BecaI__742F31CF", Column: "BecaInternaId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_AdjuntoId", Type: "Nonclustered", Columns: ["AdjuntoId"] }
            , { Name: "IX_BecaInternaId", Type: "Nonclustered", Columns: ["BecaInternaId"] }
            , { Name: "IX_BecarioDirigidoId", Type: "Nonclustered", Columns: ["BecarioDirigidoId"] }
            , { Name: "IX_CarreraId", Type: "Nonclustered", Columns: ["CarreraId"] }
            , { Name: "IX_EstadoFlujoId", Type: "Nonclustered", Columns: ["EstadoFlujoId"] }
            , { Name: "IX_InstitucionID", Type: "Nonclustered", Columns: ["InstitucionID"] }
            , { Name: "IX_PaisID", Type: "Nonclustered", Columns: ["PaisID"] }
            , { Name: "PK_CH.tab_BecarioInterno", Type: "Clustered", Columns: ["BecarioInternoId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_CapacitacionYcertificacion]", Description: ""
        , Coumns: [
            { Name: "CapacitacionYcertificacionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "FechaObtencion", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "EstadoFlujoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "Y", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "FechaValidacion", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "Impartio", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_CapacitacionYcertificacion_GEN.Adjunto_AdjuntoId", Column: "AdjuntoId", ReferenceTo: "[Adjunto].[AdjuntoId]" }
            , { Name: "FK_CH.tab_CapacitacionYcertificacion_GEN.cat_EstadoFlujo_EstadoFlujoId", Column: "EstadoFlujoId", ReferenceTo: "[cat_EstadoFlujo].[EstadoFlujoId]" }
        ]
        , Indexes: [
            { Name: "IX_AdjuntoId", Type: "Nonclustered", Columns: ["AdjuntoId"] }
            , { Name: "IX_EstadoFlujoId", Type: "Nonclustered", Columns: ["EstadoFlujoId"] }
            , { Name: "PK_CH.tab_CapacitacionYcertificacion", Type: "Clustered", Columns: ["CapacitacionYcertificacionId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_CertificacionesObtenidas]", Description: ""
        , Coumns: [
            { Name: "CertificacionesObtenidasId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "FechaValidacion", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "EstadoFlujoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "Y", Description: "" }
            , { Name: "NombreCertificacion", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "AutoridadEmisora", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "NumeroLicencia", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaInicio", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "FechaTermino", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "Url", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_CertificacionesObtenidas_GEN.Adjunto_AdjuntoId", Column: "AdjuntoId", ReferenceTo: "[Adjunto].[AdjuntoId]" }
            , { Name: "FK_CH.tab_CertificacionesObtenidas_GEN.cat_EstadoFlujo_EstadoFlujoId", Column: "EstadoFlujoId", ReferenceTo: "[cat_EstadoFlujo].[EstadoFlujoId]" }
        ]
        , Indexes: [
            { Name: "IX_AdjuntoId", Type: "Nonclustered", Columns: ["AdjuntoId"] }
            , { Name: "IX_EstadoFlujoId", Type: "Nonclustered", Columns: ["EstadoFlujoId"] }
            , { Name: "PK_CH.tab_CertificacionesObtenidas", Type: "Clustered", Columns: ["CertificacionesObtenidasId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_Competencias]", Description: ""
        , Coumns: [
            { Name: "CompetenciaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(1200)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Competencia", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "periodoId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_Competencias_CH.cat_PeriodoEvaluacion_periodoId", Column: "periodoId", ReferenceTo: "[cat_PeriodoEvaluacion].[PeriodoEvaluaionId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_Compe__perio__1486F2C8", Column: "periodoId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_periodoId", Type: "Nonclustered", Columns: ["periodoId"] }
            , { Name: "PK_CH.tab_Competencias", Type: "Clustered", Columns: ["CompetenciaId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_CursoInterno]", Description: ""
        , Coumns: [
            { Name: "CursoInternoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "FechaValidacion", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "EstadoFlujoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "Y", Description: "" }
            , { Name: "Titulo", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "ProyectoId", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "FechaCurso", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "TipoCursoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "PerteneceCP", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "PrivadoPublico", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaTermino", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "Lugar", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_CursoInterno_GEN.Adjunto_AdjuntoId", Column: "AdjuntoId", ReferenceTo: "[Adjunto].[AdjuntoId]" }
            , { Name: "FK_CH.tab_CursoInterno_GEN.cat_EstadoFlujo_EstadoFlujoId", Column: "EstadoFlujoId", ReferenceTo: "[cat_EstadoFlujo].[EstadoFlujoId]" }
            , { Name: "FK_CH.tab_CursoInterno_GEN.Proyectos_ProyectoId", Column: "ProyectoId", ReferenceTo: "[Proyectos].[ProyectoId]" }
            , { Name: "FK_CH.tab_CursoInterno_MT.cat_TipoCurso_TipoCursoId", Column: "TipoCursoId", ReferenceTo: "[cat_TipoCurso].[TipoCursoId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_Curso__Perte__5B837F96", Column: "PerteneceCP", Value: "((0))" }
            , { Name: "DF__tab_Curso__Priva__6324A15E", Column: "PrivadoPublico", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_AdjuntoId", Type: "Nonclustered", Columns: ["AdjuntoId"] }
            , { Name: "IX_EstadoFlujoId", Type: "Nonclustered", Columns: ["EstadoFlujoId"] }
            , { Name: "IX_ProyectoId", Type: "Nonclustered", Columns: ["ProyectoId"] }
            , { Name: "IX_TipoCursoId", Type: "Nonclustered", Columns: ["TipoCursoId"] }
            , { Name: "PK_CH.tab_CursoInterno", Type: "Clustered", Columns: ["CursoInternoId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_DetalleEvaluacionConductuales]", Description: ""
        , Coumns: [
            { Name: "DetalleId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "claveEvaluacion", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "MatrizId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "justificacion", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "valorReal", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_DetalleEvaluacionConductuales_CH.tab_MtrizCompetencias_MatrizId", Column: "MatrizId", ReferenceTo: "[tab_MtrizCompetencias].[matrizId]" }
        ]
        , Indexes: [
            { Name: "IX_MatrizId", Type: "Nonclustered", Columns: ["MatrizId"] }
            , { Name: "PK_CH.tab_DetalleEvaluacionConductuales", Type: "Clustered", Columns: ["DetalleId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_DetalleEvaluacionTecnicas]", Description: ""
        , Coumns: [
            { Name: "detalleId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "claveEmpleado", Datatype: "NVARCHAR(10)", Nullable: "Y", Description: "" }
            , { Name: "periodoId", Datatype: "NVARCHAR(10)", Nullable: "Y", Description: "" }
            , { Name: "idCompetenciaTecnica", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "calificacionEvaluacionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "observaciones", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "idEvaluacion", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_DetalleEvaluacionTecnicas_CH.cat_CalificacionCompetencias_calificacionEvaluacionId", Column: "calificacionEvaluacionId", ReferenceTo: "[cat_CalificacionCompetencias].[CalificacionId]" }
            , { Name: "FK_CH.tab_DetalleEvaluacionTecnicas_CH.cat_CompetenciasTecnicas_idCompetenciaTecnica", Column: "idCompetenciaTecnica", ReferenceTo: "[cat_CompetenciasTecnicas].[CompetenciaId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_Detal__idEva__5CCCA98A", Column: "idEvaluacion", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_calificacionEvaluacionId", Type: "Nonclustered", Columns: ["calificacionEvaluacionId"] }
            , { Name: "IX_idCompetenciaTecnica", Type: "Nonclustered", Columns: ["idCompetenciaTecnica"] }
            , { Name: "PK_CH.tab_DetalleEvaluacionTecnicas", Type: "Clustered", Columns: ["detalleId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_Distincion]", Description: ""
        , Coumns: [
            { Name: "DistincionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaValidacion", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "EstadoFlujoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Reconocimiento", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Aprobado", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "FechaDistincion", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "Y", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_Distincion_GEN.Adjunto_AdjuntoId", Column: "AdjuntoId", ReferenceTo: "[Adjunto].[AdjuntoId]" }
            , { Name: "FK_CH.tab_Distincion_GEN.cat_EstadoFlujo_EstadoFlujoId", Column: "EstadoFlujoId", ReferenceTo: "[cat_EstadoFlujo].[EstadoFlujoId]" }
        ]
        , Indexes: [
            { Name: "IX_AdjuntoId", Type: "Nonclustered", Columns: ["AdjuntoId"] }
            , { Name: "IX_EstadoFlujoId", Type: "Nonclustered", Columns: ["EstadoFlujoId"] }
            , { Name: "PK_CH.tab_Distincion", Type: "Clustered", Columns: ["DistincionId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_EvaluacionConductuales]", Description: ""
        , Coumns: [
            { Name: "EvaluacionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClaveEmpleado", Datatype: "NVARCHAR(10)", Nullable: "Y", Description: "" }
            , { Name: "NombreEmpleado", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "claveArea", Datatype: "NVARCHAR(10)", Nullable: "Y", Description: "" }
            , { Name: "Periodo", Datatype: "NVARCHAR(8)", Nullable: "Y", Description: "" }
            , { Name: "CategoriaCompetenciasId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "CalificacionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "EstadoEvaluacionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Fortalezas", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Debilidades", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "AreasMejora", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "visible", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "claveEvaluacion", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "CategoriaNomina", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_EvaluacionConductuales_CH.cat_CalificacionCompetencias_CalificacionId", Column: "CalificacionId", ReferenceTo: "[cat_CalificacionCompetencias].[CalificacionId]" }
            , { Name: "FK_CH.tab_EvaluacionConductuales_CH.cat_CategoriasPorFamilia_CategoriaCompetenciasId", Column: "CategoriaCompetenciasId", ReferenceTo: "[cat_CategoriasPorFamilia].[CategoriaId]" }
        ]
        , Indexes: [
            { Name: "IX_CalificacionId", Type: "Nonclustered", Columns: ["CalificacionId"] }
            , { Name: "IX_CategoriaCompetenciasId", Type: "Nonclustered", Columns: ["CategoriaCompetenciasId"] }
            , { Name: "PK_CH.tab_EvaluacionConductuales", Type: "Clustered", Columns: ["EvaluacionId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_EvaluacionEmpleadosSind]", Description: ""
        , Coumns: [
            { Name: "id", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "EvaluacionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ListaEmpleadosId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "CategoriaNomina", Datatype: "NVARCHAR(510)", Nullable: "Y", Description: "" }
            , { Name: "Periodo", Datatype: "NVARCHAR(10)", Nullable: "Y", Description: "" }
            , { Name: "CategoriaCompetenciaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "EstadoEvaluacionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "CalificacionEvaluacionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Fortalezas", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "AreasMejora", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "PlanAccion", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_EvaluacionEmpleadosSind_CH.cat_CategoriasCompetenciasSind_CategoriaCompetenciaId", Column: "CategoriaCompetenciaId", ReferenceTo: "[cat_CategoriasCompetenciasSind].[CategoriaId]" }
        ]
        , Indexes: [
            { Name: "IX_CategoriaCompetenciaId", Type: "Nonclustered", Columns: ["CategoriaCompetenciaId"] }
            , { Name: "PK_CH.tab_EvaluacionEmpleadosSind", Type: "Clustered", Columns: ["id"] }
        ]
    }
    , {
        TableName: "[CH].[tab_EvaluacionTecnicas]", Description: ""
        , Coumns: [
            { Name: "idEvaluacion", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "claveEmpleado", Datatype: "NVARCHAR(10)", Nullable: "Y", Description: "" }
            , { Name: "claveArea", Datatype: "NVARCHAR(10)", Nullable: "Y", Description: "" }
            , { Name: "claveCategoria", Datatype: "NVARCHAR(40)", Nullable: "Y", Description: "" }
            , { Name: "idPeriodo", Datatype: "NVARCHAR(10)", Nullable: "Y", Description: "" }
            , { Name: "estadoEvaluacionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "calificacionEvaluacionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "brecha", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "visible", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "tipoArea", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "nivelCompetencia", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "nombreEmpleado", Datatype: "NVARCHAR(300)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_EvaluacionTecnicas_CH.cat_CalificacionCompetencias_calificacionEvaluacionId", Column: "calificacionEvaluacionId", ReferenceTo: "[cat_CalificacionCompetencias].[CalificacionId]" }
            , { Name: "FK_CH.tab_EvaluacionTecnicas_CH.cat_EstadoEvaluacion_estadoEvaluacionId", Column: "estadoEvaluacionId", ReferenceTo: "[cat_EstadoEvaluacion].[EstadoEvaluacionId]" }
            , { Name: "FK_CH.tab_EvaluacionTecnicas_CH.cat_NivelCompetenciaTecnica_nivelCompetencia", Column: "nivelCompetencia", ReferenceTo: "[cat_NivelCompetenciaTecnica].[NivelCompetenciaId]" }
            , { Name: "FK_CH.tab_EvaluacionTecnicas_CH.cat_TipoArea_tipoArea", Column: "tipoArea", ReferenceTo: "[cat_TipoArea].[TipoAreaId]" }
        ]
        , Indexes: [
            { Name: "IX_calificacionEvaluacionId", Type: "Nonclustered", Columns: ["calificacionEvaluacionId"] }
            , { Name: "IX_estadoEvaluacionId", Type: "Nonclustered", Columns: ["estadoEvaluacionId"] }
            , { Name: "IX_nivelCompetencia", Type: "Nonclustered", Columns: ["nivelCompetencia"] }
            , { Name: "IX_tipoArea", Type: "Nonclustered", Columns: ["tipoArea"] }
            , { Name: "PK_CH.tab_EvaluacionTecnicas", Type: "Clustered", Columns: ["idEvaluacion"] }
        ]
    }
    , {
        TableName: "[CH].[tab_EvolucionPlantillaHistorico]", Description: ""
        , Coumns: [
            { Name: "EvolucionPlantillaHistoricoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Anio", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "TotalInvestigadores", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "TotalPosgrado", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CH.tab_EvolucionPlantillaHistorico", Type: "Clustered", Columns: ["EvolucionPlantillaHistoricoId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_ExperienciaDocente]", Description: ""
        , Coumns: [
            { Name: "ExperienciaDocenteId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "FechaValidacion", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "EstadoFlujoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "CursoImpartido", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "FechaInicio", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "FechaTermino", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "Y", Description: "" }
            , { Name: "InstitucionID", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "GradoAcademicoId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_ExperienciaDocente_CH.cat_GradoAcademico_GradoAcademicoId", Column: "GradoAcademicoId", ReferenceTo: "[cat_GradoAcademico].[GradoAcademicoId]" }
            , { Name: "FK_CH.tab_ExperienciaDocente_CH.cat_Instituciones_InstitucionID", Column: "InstitucionID", ReferenceTo: "[cat_Instituciones].[InstitucionID]" }
            , { Name: "FK_CH.tab_ExperienciaDocente_GEN.Adjunto_AdjuntoId", Column: "AdjuntoId", ReferenceTo: "[Adjunto].[AdjuntoId]" }
            , { Name: "FK_CH.tab_ExperienciaDocente_GEN.cat_EstadoFlujo_EstadoFlujoId", Column: "EstadoFlujoId", ReferenceTo: "[cat_EstadoFlujo].[EstadoFlujoId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_Exper__Grado__479C827A", Column: "GradoAcademicoId", Value: "((0))" }
            , { Name: "DF__tab_Exper__Insti__46A85E41", Column: "InstitucionID", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_AdjuntoId", Type: "Nonclustered", Columns: ["AdjuntoId"] }
            , { Name: "IX_EstadoFlujoId", Type: "Nonclustered", Columns: ["EstadoFlujoId"] }
            , { Name: "IX_GradoAcademicoId", Type: "Nonclustered", Columns: ["GradoAcademicoId"] }
            , { Name: "IX_InstitucionID", Type: "Nonclustered", Columns: ["InstitucionID"] }
            , { Name: "PK_CH.tab_ExperienciaDocente", Type: "Clustered", Columns: ["ExperienciaDocenteId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_ExperienciaExterna]", Description: ""
        , Coumns: [
            { Name: "ExperienciaExternaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "FechaValidacion", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "EstadoFlujoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NombreEmpresa", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "Giro", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "fechaInicio", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "fechaTermino", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "Puesto", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "PropositoPuesto", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "Actividades", Datatype: "NVARCHAR(1000)", Nullable: "Y", Description: "" }
            , { Name: "Conocimientos", Datatype: "NVARCHAR(1000)", Nullable: "Y", Description: "" }
            , { Name: "Habilidades", Datatype: "NVARCHAR(1000)", Nullable: "Y", Description: "" }
            , { Name: "Personas", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "Areas", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "Retos", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "Y", Description: "" }
            , { Name: "DuracionPuesto", Datatype: "REAL", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_ExperienciaExterna_GEN.Adjunto_AdjuntoId", Column: "AdjuntoId", ReferenceTo: "[Adjunto].[AdjuntoId]" }
            , { Name: "FK_CH.tab_ExperienciaExterna_GEN.cat_EstadoFlujo_EstadoFlujoId", Column: "EstadoFlujoId", ReferenceTo: "[cat_EstadoFlujo].[EstadoFlujoId]" }
        ]
        , Indexes: [
            { Name: "IX_AdjuntoId", Type: "Nonclustered", Columns: ["AdjuntoId"] }
            , { Name: "IX_EstadoFlujoId", Type: "Nonclustered", Columns: ["EstadoFlujoId"] }
            , { Name: "PK_CH.tab_ExperienciaExterna", Type: "Clustered", Columns: ["ExperienciaExternaId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_ExtractoProfesional]", Description: ""
        , Coumns: [
            { Name: "ClaveEmpleado", Datatype: "NVARCHAR(256)", Nullable: "N", Description: "" }
            , { Name: "Extracto", Datatype: "NVARCHAR(-1)", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CH.tab_ExtractoProfesional", Type: "Clustered", Columns: ["ClaveEmpleado"] }
        ]
    }
    , {
        TableName: "[CH].[tab_FamiliaPuestos]", Description: ""
        , Coumns: [
            { Name: "FamiliaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NombreFamilia", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "estado", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "periodoId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_FamiliaPuestos_CH.cat_PeriodoEvaluacion_periodoId", Column: "periodoId", ReferenceTo: "[cat_PeriodoEvaluacion].[PeriodoEvaluaionId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_Famil__perio__129EAA56", Column: "periodoId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_periodoId", Type: "Nonclustered", Columns: ["periodoId"] }
            , { Name: "PK_CH.tab_FamiliaPuestos", Type: "Clustered", Columns: ["FamiliaId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_FamiliaUnidad]", Description: ""
        , Coumns: [
            { Name: "FamiliaUnidadId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FamiliaPuestosId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "periodo", Datatype: "NVARCHAR(8)", Nullable: "Y", Description: "" }
            , { Name: "TipoAreaId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "unidad", Datatype: "NVARCHAR(10)", Nullable: "Y", Description: "" }
            , { Name: "nomUnidad", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_FamiliaUnidad_CH.cat_TipoArea_TipoAreaId", Column: "TipoAreaId", ReferenceTo: "[cat_TipoArea].[TipoAreaId]" }
            , { Name: "FK_CH.tab_FamiliaUnidad_CH.tab_FamiliaPuestos_familia_FamiliaId", Column: "FamiliaPuestosId", ReferenceTo: "[tab_FamiliaPuestos].[FamiliaId]" }
        ]
        , Indexes: [
            { Name: "IX_FamiliaPuestosId", Type: "Nonclustered", Columns: ["FamiliaPuestosId"] }
            , { Name: "IX_TipoAreaId", Type: "Nonclustered", Columns: ["TipoAreaId"] }
            , { Name: "PK_CH.tab_FamiliaUnidad", Type: "Clustered", Columns: ["FamiliaUnidadId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_FormacionAcademica]", Description: ""
        , Coumns: [
            { Name: "FormacionAcademicaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaValidacion", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "EstadoFlujoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "GradoAcademicoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "CarreraId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Especialidad", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "Cedula", Datatype: "NVARCHAR(60)", Nullable: "Y", Description: "" }
            , { Name: "InstitucionID", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "PaisID", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "FechaInicio", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "FechaTermino", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "EstaTitulado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "FechaValidacionTitulo", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "Y", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_FormacionAcademica_CH.cat_Carreras_CarreraId", Column: "CarreraId", ReferenceTo: "[cat_Carreras].[CarreraId]" }
            , { Name: "FK_CH.tab_FormacionAcademica_CH.cat_GradoAcademico_GradoAcademicoId", Column: "GradoAcademicoId", ReferenceTo: "[cat_GradoAcademico].[GradoAcademicoId]" }
            , { Name: "FK_CH.tab_FormacionAcademica_CH.cat_Instituciones_InstitucionID", Column: "InstitucionID", ReferenceTo: "[cat_Instituciones].[InstitucionID]" }
            , { Name: "FK_CH.tab_FormacionAcademica_GEN.Adjunto_AdjuntoId", Column: "AdjuntoId", ReferenceTo: "[Adjunto].[AdjuntoId]" }
            , { Name: "FK_CH.tab_FormacionAcademica_GEN.cat_EstadoFlujo_EstadoFlujoId", Column: "EstadoFlujoId", ReferenceTo: "[cat_EstadoFlujo].[EstadoFlujoId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_Forma__Adjun__475C8B58", Column: "AdjuntoId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_AdjuntoId", Type: "Nonclustered", Columns: ["AdjuntoId"] }
            , { Name: "IX_CarreraId", Type: "Nonclustered", Columns: ["CarreraId"] }
            , { Name: "IX_EstadoFlujoId", Type: "Nonclustered", Columns: ["EstadoFlujoId"] }
            , { Name: "IX_GradoAcademicoId", Type: "Nonclustered", Columns: ["GradoAcademicoId"] }
            , { Name: "IX_InstitucionID", Type: "Nonclustered", Columns: ["InstitucionID"] }
            , { Name: "PK_CH.tab_FormacionAcademica", Type: "Clustered", Columns: ["FormacionAcademicaId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_FortalezasCompetencias]", Description: ""
        , Coumns: [
            { Name: "Id", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "EmpleadoEvaluacionId", Datatype: "INT", Nullable: "Y", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CH.tab_FortalezasCompetencias", Type: "Clustered", Columns: ["Id"] }
        ]
    }
    , {
        TableName: "[CH].[tab_Idioma]", Description: ""
        , Coumns: [
            { Name: "IdiomasId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaValidacion", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "EstadoFlujoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "IdiomaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "PorcentajeGradoDominio", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "PorcentajeConversacion", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "PorcentajeEscritura", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "PorcentajeLectura", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaAcreditacion", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Puntuacion", Datatype: "REAL", Nullable: "N", Description: "" }
            , { Name: "CertificacionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "Y", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_Idioma_GEN.Adjunto_AdjuntoId", Column: "AdjuntoId", ReferenceTo: "[Adjunto].[AdjuntoId]" }
            , { Name: "FK_CH.tab_Idioma_GEN.cat_EstadoFlujo_EstadoFlujoId", Column: "EstadoFlujoId", ReferenceTo: "[cat_EstadoFlujo].[EstadoFlujoId]" }
            , { Name: "FK_CH.tab_Idiomas_CH.cat_Certificacion_CertificacionId", Column: "CertificacionId", ReferenceTo: "[cat_Certificacion].[CertificacionId]" }
            , { Name: "FK_CH.tab_Idiomas_CH.cat_Idioma_IdiomaId", Column: "IdiomaId", ReferenceTo: "[cat_Idioma].[IdiomaId]" }
        ]
        , Indexes: [
            { Name: "IX_AdjuntoId", Type: "Nonclustered", Columns: ["AdjuntoId"] }
            , { Name: "IX_CertificacionId", Type: "Nonclustered", Columns: ["CertificacionId"] }
            , { Name: "IX_EstadoFlujoId", Type: "Nonclustered", Columns: ["EstadoFlujoId"] }
            , { Name: "IX_IdiomaId", Type: "Nonclustered", Columns: ["IdiomaId"] }
            , { Name: "PK_CH.tab_Idiomas", Type: "Clustered", Columns: ["IdiomasId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_ListadoEmpleadosSind]", Description: ""
        , Coumns: [
            { Name: "Id", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "EmpleadoId", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "NombreEmpleado", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "NoEmpleado", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "ListaId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_Lista__Lista__7DF8932B", Column: "ListaId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "PK_CH.tab_ListadoEmpleadosSind", Type: "Clustered", Columns: ["Id"] }
        ]
    }
    , {
        TableName: "[CH].[tab_LogrosReconocimientos]", Description: ""
        , Coumns: [
            { Name: "LogrosReconocimientosId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "FechaValidacion", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "EstadoFlujoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "Y", Description: "" }
            , { Name: "Titulo", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Emisor", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "FechaObtencion", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_LogrosReconocimientos_GEN.Adjunto_AdjuntoId", Column: "AdjuntoId", ReferenceTo: "[Adjunto].[AdjuntoId]" }
            , { Name: "FK_CH.tab_LogrosReconocimientos_GEN.cat_EstadoFlujo_EstadoFlujoId", Column: "EstadoFlujoId", ReferenceTo: "[cat_EstadoFlujo].[EstadoFlujoId]" }
        ]
        , Indexes: [
            { Name: "IX_AdjuntoId", Type: "Nonclustered", Columns: ["AdjuntoId"] }
            , { Name: "IX_EstadoFlujoId", Type: "Nonclustered", Columns: ["EstadoFlujoId"] }
            , { Name: "PK_CH.tab_LogrosReconocimientos", Type: "Clustered", Columns: ["LogrosReconocimientosId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_ManualCompetenciaConductual]", Description: ""
        , Coumns: [
            { Name: "ManualCompetenciaConductualId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "PeriodoEvaluaionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "AccesoPublico", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Version", Datatype: "REAL", Nullable: "N", Description: "" }
            , { Name: "Comentario", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_ManualCompetenciaConductual_CH.cat_PeriodoEvaluacion_PeriodoEvaluaionId", Column: "PeriodoEvaluaionId", ReferenceTo: "[cat_PeriodoEvaluacion].[PeriodoEvaluaionId]" }
            , { Name: "FK_CH.tab_ManualCompetenciaConductual_GEN.Adjunto_AdjuntoId", Column: "AdjuntoId", ReferenceTo: "[Adjunto].[AdjuntoId]" }
        ]
        , Indexes: [
            { Name: "IX_AdjuntoId", Type: "Nonclustered", Columns: ["AdjuntoId"] }
            , { Name: "IX_PeriodoEvaluaionId", Type: "Nonclustered", Columns: ["PeriodoEvaluaionId"] }
            , { Name: "PK_CH.tab_ManualCompetenciaConductual", Type: "Clustered", Columns: ["ManualCompetenciaConductualId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_ManualCompetenciaTecnica]", Description: ""
        , Coumns: [
            { Name: "ManualCompetenciaTecnicaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "PeriodoEvaluaionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "AccesoPublico", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Version", Datatype: "REAL", Nullable: "N", Description: "" }
            , { Name: "Comentario", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_ManualCompetenciaTecnica_CH.cat_PeriodoEvaluacion_PeriodoEvaluaionId", Column: "PeriodoEvaluaionId", ReferenceTo: "[cat_PeriodoEvaluacion].[PeriodoEvaluaionId]" }
            , { Name: "FK_CH.tab_ManualCompetenciaTecnica_GEN.Adjunto_AdjuntoId", Column: "AdjuntoId", ReferenceTo: "[Adjunto].[AdjuntoId]" }
        ]
        , Indexes: [
            { Name: "IX_AdjuntoId", Type: "Nonclustered", Columns: ["AdjuntoId"] }
            , { Name: "IX_PeriodoEvaluaionId", Type: "Nonclustered", Columns: ["PeriodoEvaluaionId"] }
            , { Name: "PK_CH.tab_ManualCompetenciaTecnica", Type: "Clustered", Columns: ["ManualCompetenciaTecnicaId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_MtrizCompetencias]", Description: ""
        , Coumns: [
            { Name: "matrizId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "competenciaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "categoriaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "nivelId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "periodo", Datatype: "NVARCHAR(8)", Nullable: "Y", Description: "" }
            , { Name: "estado", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "claveMatriz", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_MtrizCompetencias_CH.cat_CategoriasPorFamilia_categoriaId", Column: "categoriaId", ReferenceTo: "[cat_CategoriasPorFamilia].[CategoriaId]" }
            , { Name: "FK_CH.tab_MtrizCompetencias_CH.cat_DescripcionNiveles_nivelId", Column: "nivelId", ReferenceTo: "[cat_DescripcionNiveles].[descNivelId]" }
            , { Name: "FK_CH.tab_MtrizCompetencias_CH.tab_Competencias_competenciaId", Column: "competenciaId", ReferenceTo: "[tab_Competencias].[CompetenciaId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_Mtriz__clave__34BEB830", Column: "claveMatriz", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_categoriaId", Type: "Nonclustered", Columns: ["categoriaId"] }
            , { Name: "IX_competenciaId", Type: "Nonclustered", Columns: ["competenciaId"] }
            , { Name: "IX_nivelId", Type: "Nonclustered", Columns: ["nivelId"] }
            , { Name: "PK_CH.tab_MtrizCompetencias", Type: "Clustered", Columns: ["matrizId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_PlanAccionCompetencias]", Description: ""
        , Coumns: [
            { Name: "Id", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "EmpleadoEvaluacionId", Datatype: "INT", Nullable: "Y", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CH.tab_PlanAccionCompetencias", Type: "Clustered", Columns: ["Id"] }
        ]
    }
    , {
        TableName: "[CH].[tab_Ponencia]", Description: ""
        , Coumns: [
            { Name: "PonenciaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "FechaValidacion", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "EstadoFlujoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "CongresoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "TituloPonencia", Datatype: "NVARCHAR(600)", Nullable: "Y", Description: "" }
            , { Name: "Especialidad", Datatype: "NVARCHAR(300)", Nullable: "Y", Description: "" }
            , { Name: "FechaInicio", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "AmbitoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NivelPublicacionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "year", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "Paginas", Datatype: "NVARCHAR(60)", Nullable: "Y", Description: "" }
            , { Name: "EstadoPonenciaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "Y", Description: "" }
            , { Name: "PalabrasClave", Datatype: "NVARCHAR(600)", Nullable: "Y", Description: "" }
            , { Name: "Numero", Datatype: "NVARCHAR(10)", Nullable: "Y", Description: "" }
            , { Name: "EstadoActivoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "PaisID", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "ProyectoId", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "nota", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_Ponencia_CH.cat_Ambito_AmbitoId", Column: "AmbitoId", ReferenceTo: "[cat_Ambito].[AmbitoId]" }
            , { Name: "FK_CH.tab_Ponencia_CH.cat_Congresos_CongresoId", Column: "CongresoId", ReferenceTo: "[cat_Congresos].[CongresoId]" }
            , { Name: "FK_CH.tab_Ponencia_CH.cat_EstadoPonencia_EstadoPonenciaId", Column: "EstadoPonenciaId", ReferenceTo: "[cat_EstadoPonencia].[EstadoPonenciaId]" }
            , { Name: "FK_CH.tab_Ponencia_CH.cat_NivelPublicacion_NivelPublicacionId", Column: "NivelPublicacionId", ReferenceTo: "[cat_NivelPublicacion].[NivelPublicacionId]" }
            , { Name: "FK_CH.tab_Ponencia_CH.cat_Pais_PaisID", Column: "PaisID", ReferenceTo: "[cat_Pais].[PaisID]" }
            , { Name: "FK_CH.tab_Ponencia_GEN.Adjunto_AdjuntoId", Column: "AdjuntoId", ReferenceTo: "[Adjunto].[AdjuntoId]" }
            , { Name: "FK_CH.tab_Ponencia_GEN.cat_EstadoFlujo_EstadoFlujoId", Column: "EstadoFlujoId", ReferenceTo: "[cat_EstadoFlujo].[EstadoFlujoId]" }
            , { Name: "FK_CH.tab_Ponencia_GEN.Proyectos_ProyectoId", Column: "ProyectoId", ReferenceTo: "[Proyectos].[ProyectoId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_Ponen__Estad__00EA0E6F", Column: "EstadoActivoId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_AdjuntoId", Type: "Nonclustered", Columns: ["AdjuntoId"] }
            , { Name: "IX_AmbitoId", Type: "Nonclustered", Columns: ["AmbitoId"] }
            , { Name: "IX_CongresoId", Type: "Nonclustered", Columns: ["CongresoId"] }
            , { Name: "IX_EstadoFlujoId", Type: "Nonclustered", Columns: ["EstadoFlujoId"] }
            , { Name: "IX_EstadoPonenciaId", Type: "Nonclustered", Columns: ["EstadoPonenciaId"] }
            , { Name: "IX_NivelPublicacionId", Type: "Nonclustered", Columns: ["NivelPublicacionId"] }
            , { Name: "IX_PaisID", Type: "Nonclustered", Columns: ["PaisID"] }
            , { Name: "IX_ProyectoId", Type: "Nonclustered", Columns: ["ProyectoId"] }
            , { Name: "PK_CH.tab_Ponencia", Type: "Clustered", Columns: ["PonenciaId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_Publicacion]", Description: ""
        , Coumns: [
            { Name: "PublicacionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "FechaValidacion", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "EstadoFlujoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "RevistaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "TituloPublicacion", Datatype: "NVARCHAR(600)", Nullable: "Y", Description: "" }
            , { Name: "Especialidad", Datatype: "NVARCHAR(300)", Nullable: "Y", Description: "" }
            , { Name: "AmbitoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NivelPublicacionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Year", Datatype: "NVARCHAR(60)", Nullable: "Y", Description: "" }
            , { Name: "Paginas", Datatype: "NVARCHAR(60)", Nullable: "Y", Description: "" }
            , { Name: "EstadoPublicacionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaPublicacion", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "PalabrasClave", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Numero", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Volumen", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "Y", Description: "" }
            , { Name: "EstadoActivoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ProyectoId", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "nota", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_Publicacion_CH.cat_Ambito_AmbitoId", Column: "AmbitoId", ReferenceTo: "[cat_Ambito].[AmbitoId]" }
            , { Name: "FK_CH.tab_Publicacion_CH.cat_EstadosPublicacion_EstadoPublicacionId", Column: "EstadoPublicacionId", ReferenceTo: "[cat_EstadosPublicacion].[EstadoPublicacionId]" }
            , { Name: "FK_CH.tab_Publicacion_CH.cat_NivelPublicacion_NivelPublicacionId", Column: "NivelPublicacionId", ReferenceTo: "[cat_NivelPublicacion].[NivelPublicacionId]" }
            , { Name: "FK_CH.tab_Publicacion_CH.cat_Revistas_RevistaId", Column: "RevistaId", ReferenceTo: "[cat_Revistas].[RevistaId]" }
            , { Name: "FK_CH.tab_Publicacion_GEN.Adjunto_AdjuntoId", Column: "AdjuntoId", ReferenceTo: "[Adjunto].[AdjuntoId]" }
            , { Name: "FK_CH.tab_Publicacion_GEN.cat_EstadoFlujo_EstadoFlujoId", Column: "EstadoFlujoId", ReferenceTo: "[cat_EstadoFlujo].[EstadoFlujoId]" }
            , { Name: "FK_CH.tab_Publicacion_GEN.Proyectos_ProyectoId", Column: "ProyectoId", ReferenceTo: "[Proyectos].[ProyectoId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_Publi__Estad__01DE32A8", Column: "EstadoActivoId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_AdjuntoId", Type: "Nonclustered", Columns: ["AdjuntoId"] }
            , { Name: "IX_AmbitoId", Type: "Nonclustered", Columns: ["AmbitoId"] }
            , { Name: "IX_EstadoFlujoId", Type: "Nonclustered", Columns: ["EstadoFlujoId"] }
            , { Name: "IX_EstadoPublicacionId", Type: "Nonclustered", Columns: ["EstadoPublicacionId"] }
            , { Name: "IX_NivelPublicacionId", Type: "Nonclustered", Columns: ["NivelPublicacionId"] }
            , { Name: "IX_ProyectoId", Type: "Nonclustered", Columns: ["ProyectoId"] }
            , { Name: "IX_RevistaId", Type: "Nonclustered", Columns: ["RevistaId"] }
            , { Name: "PK_CH.tab_Publicacion", Type: "Clustered", Columns: ["PublicacionId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_SitioWebCurso]", Description: ""
        , Coumns: [
            { Name: "SitioWebCursoInternoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Url", Datatype: "NVARCHAR(-1)", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(600)", Nullable: "Y", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "CursoInternoId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_SitioWebCurso_CH.tab_CursoInterno_CursoInternoId", Column: "CursoInternoId", ReferenceTo: "[tab_CursoInterno].[CursoInternoId]" }
        ]
        , Indexes: [
            { Name: "IX_CursoInternoId", Type: "Nonclustered", Columns: ["CursoInternoId"] }
            , { Name: "PK_CH.tab_SitioWebCurso", Type: "Clustered", Columns: ["SitioWebCursoInternoId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_SNI]", Description: ""
        , Coumns: [
            { Name: "SNIId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "fechaValidacion", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "EstadoFlujoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "fechaIngreso", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "numeroCVU", Datatype: "NVARCHAR(60)", Nullable: "Y", Description: "" }
            , { Name: "fechaInicioNombramiento", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "fechaTerminoNombramiento", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "NivelSNIId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "AreaSNIId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "numeroExpediente", Datatype: "NVARCHAR(60)", Nullable: "Y", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "Y", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_SNI_CH.cat_AreaSNI_AreaSNIId", Column: "AreaSNIId", ReferenceTo: "[cat_AreaSNI].[AreaSNIId]" }
            , { Name: "FK_CH.tab_SNI_CH.cat_NivelSNI_NivelSNIId", Column: "NivelSNIId", ReferenceTo: "[cat_NivelSNI].[NivelSNIId]" }
            , { Name: "FK_CH.tab_SNI_GEN.Adjunto_AdjuntoId", Column: "AdjuntoId", ReferenceTo: "[Adjunto].[AdjuntoId]" }
            , { Name: "FK_CH.tab_SNI_GEN.cat_EstadoFlujo_EstadoFlujoId", Column: "EstadoFlujoId", ReferenceTo: "[cat_EstadoFlujo].[EstadoFlujoId]" }
        ]
        , Indexes: [
            { Name: "IX_AdjuntoId", Type: "Nonclustered", Columns: ["AdjuntoId"] }
            , { Name: "IX_AreaSNIId", Type: "Nonclustered", Columns: ["AreaSNIId"] }
            , { Name: "IX_EstadoFlujoId", Type: "Nonclustered", Columns: ["EstadoFlujoId"] }
            , { Name: "IX_NivelSNIId", Type: "Nonclustered", Columns: ["NivelSNIId"] }
            , { Name: "PK_CH.tab_SNI", Type: "Clustered", Columns: ["SNIId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_Solicitud]", Description: ""
        , Coumns: [
            { Name: "SolicitudId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "TipoInformacionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "InformacionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaSolicitud", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "EstadoFlujoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "ClavePersonaAut", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "tipoPersonal_Id", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "ClaveUnidadAut", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_Solicitud_CH.cat_TipoInformacion_TipoInformacionId", Column: "TipoInformacionId", ReferenceTo: "[cat_TipoInformacion].[TipoInformacionId]" }
            , { Name: "FK_CH.tab_Solicitud_GEN.cat_EstadoFlujo_EstadoFlujoId", Column: "EstadoFlujoId", ReferenceTo: "[cat_EstadoFlujo].[EstadoFlujoId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_Solic__Clave__31583BA0", Column: "ClavePersonaAut", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_EstadoFlujoId", Type: "Nonclustered", Columns: ["EstadoFlujoId"] }
            , { Name: "IX_TipoInformacionId", Type: "Nonclustered", Columns: ["TipoInformacionId"] }
            , { Name: "PK_CH.tab_Solicitud", Type: "Clustered", Columns: ["SolicitudId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_SolicitudCP]", Description: ""
        , Coumns: [
            { Name: "SolicitudCPId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "TipoInformacionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "InformacionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaSolicitud", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "EstadoFlujoId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_SolicitudCP_CH.cat_TipoInformacion_TipoInformacionId", Column: "TipoInformacionId", ReferenceTo: "[cat_TipoInformacion].[TipoInformacionId]" }
            , { Name: "FK_CH.tab_SolicitudCP_GEN.cat_EstadoFlujo_EstadoFlujoId", Column: "EstadoFlujoId", ReferenceTo: "[cat_EstadoFlujo].[EstadoFlujoId]" }
        ]
        , Indexes: [
            { Name: "IX_EstadoFlujoId", Type: "Nonclustered", Columns: ["EstadoFlujoId"] }
            , { Name: "IX_TipoInformacionId", Type: "Nonclustered", Columns: ["TipoInformacionId"] }
            , { Name: "PK_CH.tab_SolicitudCP", Type: "Clustered", Columns: ["SolicitudCPId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_TesisDirigida]", Description: ""
        , Coumns: [
            { Name: "TesisDirigidaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaValidacion", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "EstadoFlujoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Titulo", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "FechaExamen", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "GradoAcademicoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaAceptacion", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "FechaInicio", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "FechaTermino", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "Y", Description: "" }
            , { Name: "PalabrasClave", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "BecarioDirigidoId", Datatype: "INT", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_TesisDirigida_CH.cat_GradoAcademico_GradoAcademicoId", Column: "GradoAcademicoId", ReferenceTo: "[cat_GradoAcademico].[GradoAcademicoId]" }
            , { Name: "FK_CH.tab_TesisDirigida_GEN.Adjunto_AdjuntoId", Column: "AdjuntoId", ReferenceTo: "[Adjunto].[AdjuntoId]" }
            , { Name: "FK_CH.tab_TesisDirigida_GEN.cat_EstadoFlujo_EstadoFlujoId", Column: "EstadoFlujoId", ReferenceTo: "[cat_EstadoFlujo].[EstadoFlujoId]" }
        ]
        , Indexes: [
            { Name: "IX_AdjuntoId", Type: "Nonclustered", Columns: ["AdjuntoId"] }
            , { Name: "IX_EstadoFlujoId", Type: "Nonclustered", Columns: ["EstadoFlujoId"] }
            , { Name: "IX_GradoAcademicoId", Type: "Nonclustered", Columns: ["GradoAcademicoId"] }
            , { Name: "PK_CH.tab_TesisDirigida", Type: "Clustered", Columns: ["TesisDirigidaId"] }
        ]
    }
    , {
        TableName: "[CH].[tab_Usuario]", Description: ""
        , Coumns: [
            { Name: "apellidoPaterno", Datatype: "NVARCHAR(160)", Nullable: "Y", Description: "" }
            , { Name: "apellidoMaterno", Datatype: "NVARCHAR(160)", Nullable: "Y", Description: "" }
            , { Name: "fechaIngreso", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "gerencia", Datatype: "NVARCHAR(160)", Nullable: "Y", Description: "" }
            , { Name: "categoriaActual", Datatype: "NVARCHAR(160)", Nullable: "Y", Description: "" }
            , { Name: "antiguedad", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "numEmpleado", Datatype: "NVARCHAR(20)", Nullable: "N", Description: "" }
            , { Name: "nombreEmpleado", Datatype: "NVARCHAR(160)", Nullable: "Y", Description: "" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tUsuario__numEmp__37703C52", Column: "numEmpleado", Value: "('')" }
        ]
        , Indexes: [
            { Name: "PK_CH.tUsuario", Type: "Clustered", Columns: ["numEmpleado"] }
        ]
    }
    , {
        TableName: "[CH].[temp_InvestigadoresHome]", Description: ""
        , Coumns: [
            { Name: "InvestigadoresHomeId", Datatype: "BIGINT", Nullable: "N", Description: "" }
            , { Name: "Fecha", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "GraficaJson", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CH.temp_InvestigadoresHome", Type: "Clustered", Columns: ["InvestigadoresHomeId"] }
        ]
    }
    , {
        TableName: "[CR].[cat_Alumnos]", Description: ""
        , Coumns: [
            { Name: "AlumnoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(400)", Nullable: "N", Description: "" }
            , { Name: "ApellidoPaterno", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "ApellidoMaterno", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "Edad", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Sexo", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CR.cat_Alumnos", Type: "Clustered", Columns: ["AlumnoId"] }
        ]
    }
    , {
        TableName: "[CR].[cat_AmbitoConv]", Description: ""
        , Coumns: [
            { Name: "AmbitoConvId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(100)", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(600)", Nullable: "Y", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "IX_Nombre", Type: "Nonclustered", Columns: ["Nombre"] }
            , { Name: "PK_CR.cat_AmbitoConv", Type: "Clustered", Columns: ["AmbitoConvId"] }
        ]
    }
    , {
        TableName: "[CR].[cat_AreaInvestigacion]", Description: ""
        , Coumns: [
            { Name: "AreaInvestigacionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(600)", Nullable: "Y", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CR.cat_AreaInvestigacion", Type: "Clustered", Columns: ["AreaInvestigacionId"] }
        ]
    }
    , {
        TableName: "[CR].[cat_ClavesEmpresas]", Description: ""
        , Coumns: [
            { Name: "ClaveEmpresasId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClaveEmpresa", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CR.cat_ClavesEmpresas", Type: "Clustered", Columns: ["ClaveEmpresasId"] }
        ]
    }
    , {
        TableName: "[CR].[cat_Contactos]", Description: ""
        , Coumns: [
            { Name: "ContactoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NombreContacto", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "ApellidoPaterno", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "ApellidoMaterno", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "Telefono", Datatype: "NVARCHAR(62)", Nullable: "Y", Description: "" }
            , { Name: "Correo", Datatype: "NVARCHAR(302)", Nullable: "Y", Description: "" }
            , { Name: "Direccion", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "EmpresaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Puesto", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "RedFacebook", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "RedTwitter", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "RedLinkedin", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "Extension", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "Y", Description: "" }
            , { Name: "PaisId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "EstadoId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "MunicipioId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "Edo", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "Munipio", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "Colonia", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "Calle", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "CP", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "Celular", Datatype: "NVARCHAR(60)", Nullable: "Y", Description: "" }
            , { Name: "ClaveUnidad", Datatype: "NVARCHAR(40)", Nullable: "Y", Description: "" }
            , { Name: "Localidad", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "EstadoContacto", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "PaisOrigenId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "TituloId", Datatype: "INT", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.cat_Contactos_CR.cat_Empresas_EmpresaId", Column: "EmpresaId", ReferenceTo: "[cat_Empresas].[EmpresaId]" }
            , { Name: "FK_CR.cat_Contactos_CR.cat_TituloPersona_TituloId", Column: "TituloId", ReferenceTo: "[cat_TituloPersona].[TituloId]" }
            , { Name: "FK_CR.cat_Contactos_CR.UnidadOrganizacionalEmpresas_ClaveUnidad", Column: "ClaveUnidad", ReferenceTo: "[UnidadOrganizacionalEmpresas].[ClaveUnidad]" }
            , { Name: "FK_CR.cat_Contactos_GEN.cat_Estados_EstadoId", Column: "EstadoId", ReferenceTo: "[cat_Estados].[EstadoId]" }
            , { Name: "FK_CR.cat_Contactos_GEN.cat_Municipios_MunicipioId", Column: "MunicipioId", ReferenceTo: "[cat_Municipios].[MunicipioId]" }
            , { Name: "FK_CR.cat_Contactos_GEN.cat_Paises_PaisId", Column: "PaisId", ReferenceTo: "[cat_Paises].[PaisId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__cat_Conta__Adjun__08362A7C", Column: "AdjuntoId", Value: "((0))" }
            , { Name: "DF__cat_Conta__Autor__5CC1BC92", Column: "Autor", Value: "('')" }
            , { Name: "DF__cat_Conta__Empre__67FE6514", Column: "EmpresaId", Value: "((0))" }
            , { Name: "DF__cat_Conta__Estad__5DB5E0CB", Column: "Estado", Value: "((0))" }
            , { Name: "DF__cat_Conta__Fecha__5BCD9859", Column: "FechaRegistro", Value: "('1900-01-01T00:00:00.000')" }
            , { Name: "DF__cat_Conta__Puest__16B953FD", Column: "Puesto", Value: "('')" }
            , { Name: "DF__cat_Conta__RedFa__17AD7836", Column: "RedFacebook", Value: "('')" }
            , { Name: "DF__cat_Conta__RedLi__1995C0A8", Column: "RedLinkedin", Value: "('')" }
            , { Name: "DF__cat_Conta__RedTw__18A19C6F", Column: "RedTwitter", Value: "('')" }
        ]
        , Indexes: [
            { Name: "IX_AdjuntoId", Type: "Nonclustered", Columns: ["AdjuntoId"] }
            , { Name: "IX_ClaveUnidad", Type: "Nonclustered", Columns: ["ClaveUnidad"] }
            , { Name: "IX_EmpresaId", Type: "Nonclustered", Columns: ["EmpresaId"] }
            , { Name: "IX_EstadoId", Type: "Nonclustered", Columns: ["EstadoId"] }
            , { Name: "IX_MunicipioId", Type: "Nonclustered", Columns: ["MunicipioId"] }
            , { Name: "IX_PaisId", Type: "Nonclustered", Columns: ["PaisId"] }
            , { Name: "IX_TituloId", Type: "Nonclustered", Columns: ["TituloId"] }
            , { Name: "PK_CR.cat_Contactos", Type: "Clustered", Columns: ["ContactoId"] }
        ]
    }
    , {
        TableName: "[CR].[cat_Empresas]", Description: ""
        , Coumns: [
            { Name: "EmpresaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NombreEmpresa", Datatype: "NVARCHAR(500)", Nullable: "Y", Description: "" }
            , { Name: "NombreTitular", Datatype: "NVARCHAR(500)", Nullable: "Y", Description: "" }
            , { Name: "Puesto", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "Telefono", Datatype: "NVARCHAR(30)", Nullable: "Y", Description: "" }
            , { Name: "Ext", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "Correo", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "SitioWeb", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(500)", Nullable: "Y", Description: "" }
            , { Name: "Nivel", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "Celular", Datatype: "NVARCHAR(30)", Nullable: "Y", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "Y", Description: "" }
            , { Name: "Edo", Datatype: "NVARCHAR(500)", Nullable: "Y", Description: "" }
            , { Name: "Calle", Datatype: "NVARCHAR(500)", Nullable: "Y", Description: "" }
            , { Name: "Colonia", Datatype: "NVARCHAR(500)", Nullable: "Y", Description: "" }
            , { Name: "CP", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "RFC", Datatype: "NVARCHAR(500)", Nullable: "Y", Description: "" }
            , { Name: "RazonSocial", Datatype: "NVARCHAR(500)", Nullable: "Y", Description: "" }
            , { Name: "EdoR", Datatype: "NVARCHAR(500)", Nullable: "Y", Description: "" }
            , { Name: "MunicipioR", Datatype: "NVARCHAR(500)", Nullable: "Y", Description: "" }
            , { Name: "CalleR", Datatype: "NVARCHAR(500)", Nullable: "Y", Description: "" }
            , { Name: "ColoniaR", Datatype: "NVARCHAR(500)", Nullable: "Y", Description: "" }
            , { Name: "CPR", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "Munipio", Datatype: "NVARCHAR(500)", Nullable: "Y", Description: "" }
            , { Name: "PaisId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "EstadoId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "MunicipioId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "PaisIdRS", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "EstadoIdRS", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "MunicipioIdRS", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "Localidad", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "LocalidadRS", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "EstadoEmpresa", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "TipoOrganizacionId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "ClaveEmpresa", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.cat_Empresas_CR.cat_TipoOrganizacion_TipoOrganizacionId", Column: "TipoOrganizacionId", ReferenceTo: "[cat_TipoOrganizacion].[TipoOrganizacionId]" }
            , { Name: "FK_CR.cat_Empresas_GEN.Adjunto_AdjuntoId", Column: "AdjuntoId", ReferenceTo: "[Adjunto].[AdjuntoId]" }
            , { Name: "FK_CR.cat_Empresas_GEN.cat_Estados_EstadoId", Column: "EstadoId", ReferenceTo: "[cat_Estados].[EstadoId]" }
            , { Name: "FK_CR.cat_Empresas_GEN.cat_Estados_EstadoIdRS", Column: "EstadoIdRS", ReferenceTo: "[cat_Estados].[EstadoId]" }
            , { Name: "FK_CR.cat_Empresas_GEN.cat_Municipios_MunicipioId", Column: "MunicipioId", ReferenceTo: "[cat_Municipios].[MunicipioId]" }
            , { Name: "FK_CR.cat_Empresas_GEN.cat_Municipios_MunicipioIdRS", Column: "MunicipioIdRS", ReferenceTo: "[cat_Municipios].[MunicipioId]" }
            , { Name: "FK_CR.cat_Empresas_GEN.cat_Paises_PaisId", Column: "PaisId", ReferenceTo: "[cat_Paises].[PaisId]" }
            , { Name: "FK_CR.cat_Empresas_GEN.cat_Paises_PaisIdRS", Column: "PaisIdRS", ReferenceTo: "[cat_Paises].[PaisId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__cat_Empre__Autor__5F9E293D", Column: "Autor", Value: "('')" }
            , { Name: "DF__cat_Empre__Estad__60924D76", Column: "Estado", Value: "((0))" }
            , { Name: "DF__cat_Empre__Fecha__5EAA0504", Column: "FechaRegistro", Value: "('1900-01-01T00:00:00.000')" }
        ]
        , Indexes: [
            { Name: "IX_AdjuntoId", Type: "Nonclustered", Columns: ["AdjuntoId"] }
            , { Name: "IX_EstadoId", Type: "Nonclustered", Columns: ["EstadoId"] }
            , { Name: "IX_EstadoIdRS", Type: "Nonclustered", Columns: ["EstadoIdRS"] }
            , { Name: "IX_MunicipioId", Type: "Nonclustered", Columns: ["MunicipioId"] }
            , { Name: "IX_MunicipioIdRS", Type: "Nonclustered", Columns: ["MunicipioIdRS"] }
            , { Name: "IX_PaisId", Type: "Nonclustered", Columns: ["PaisId"] }
            , { Name: "IX_PaisIdRS", Type: "Nonclustered", Columns: ["PaisIdRS"] }
            , { Name: "IX_TipoOrganizacionId", Type: "Nonclustered", Columns: ["TipoOrganizacionId"] }
            , { Name: "PK_CR.cat_Empresas", Type: "Clustered", Columns: ["EmpresaId"] }
        ]
    }
    , {
        TableName: "[CR].[cat_Expertos]", Description: ""
        , Coumns: [
            { Name: "ExpertoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ContactoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "TipoExperto", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ComunidadId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "Especialidad", Datatype: "NVARCHAR(-1)", Nullable: "N", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "LineaDesarrolloTecnologicoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(20)", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.cat_Expertos_CR.cat_LineaDesarrolloTecnologico_LineaDesarrolloTecnologicoId", Column: "LineaDesarrolloTecnologicoId", ReferenceTo: "[cat_LineaDesarrolloTecnologico].[LineaDesarrolloTecnologicoId]" }
        ]
        , Indexes: [
            { Name: "IX_LineaDesarrolloTecnologicoId", Type: "Nonclustered", Columns: ["LineaDesarrolloTecnologicoId"] }
            , { Name: "PK_CR.cat_Expertos", Type: "Clustered", Columns: ["ExpertoId"] }
        ]
    }
    , {
        TableName: "[CR].[cat_LineaDesarrolloTecnologico]", Description: ""
        , Coumns: [
            { Name: "LineaDesarrolloTecnologicoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NomLinDesTec", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "DesLinDesTec", Datatype: "NVARCHAR(1200)", Nullable: "Y", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CR.cat_LineaDesarrolloTecnologico", Type: "Clustered", Columns: ["LineaDesarrolloTecnologicoId"] }
        ]
    }
    , {
        TableName: "[CR].[cat_NaturalezaInteraccion]", Description: ""
        , Coumns: [
            { Name: "NaturalezaInteraccionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(600)", Nullable: "Y", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CR.cat_NaturalezaInteraccion", Type: "Clustered", Columns: ["NaturalezaInteraccionId"] }
        ]
    }
    , {
        TableName: "[CR].[cat_Producto]", Description: ""
        , Coumns: [
            { Name: "ProductoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NomProd", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "DescProd", Datatype: "NVARCHAR(600)", Nullable: "Y", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
        ]
        , DefaultConstraints: [
            { Name: "DF__cat_Produ__Estad__2E70E1FD", Column: "Estado", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "PK_CR.cat_Producto", Type: "Clustered", Columns: ["ProductoId"] }
        ]
    }
    , {
        TableName: "[CR].[cat_RedSocial]", Description: ""
        , Coumns: [
            { Name: "RedSocialID", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NombreRedSocial", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "ContactoID", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CR.cat_RedSocial", Type: "Clustered", Columns: ["RedSocialID"] }
        ]
    }
    , {
        TableName: "[CR].[cat_SegmentoMercado]", Description: ""
        , Coumns: [
            { Name: "SegmentoMercadoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NomSegMerc", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "DesSegMerc", Datatype: "NVARCHAR(600)", Nullable: "Y", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CR.cat_SegmentoMercado", Type: "Clustered", Columns: ["SegmentoMercadoId"] }
        ]
    }
    , {
        TableName: "[CR].[cat_Servicio]", Description: ""
        , Coumns: [
            { Name: "ServicioId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NomServ", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "DescServ", Datatype: "NVARCHAR(600)", Nullable: "Y", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CR.cat_Servicio", Type: "Clustered", Columns: ["ServicioId"] }
        ]
    }
    , {
        TableName: "[CR].[cat_TamanoEmpresa]", Description: ""
        , Coumns: [
            { Name: "TamanoEmpresaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NomTamEmp", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "DesTamEmp", Datatype: "NVARCHAR(600)", Nullable: "Y", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CR.cat_TamanoEmpresa", Type: "Clustered", Columns: ["TamanoEmpresaId"] }
        ]
    }
    , {
        TableName: "[CR].[cat_Tematicas]", Description: ""
        , Coumns: [
            { Name: "TematicaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(600)", Nullable: "Y", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CR.cat_Tematicas", Type: "Clustered", Columns: ["TematicaId"] }
        ]
    }
    , {
        TableName: "[CR].[cat_TipoConvenio]", Description: ""
        , Coumns: [
            { Name: "ConvenioId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NomTipConv", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "DescTipConv", Datatype: "NVARCHAR(600)", Nullable: "N", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CR.cat_TipoConvenio", Type: "Clustered", Columns: ["ConvenioId"] }
        ]
    }
    , {
        TableName: "[CR].[cat_TipoFuentesFinanciamiento]", Description: ""
        , Coumns: [
            { Name: "TipoFuenteFinanciamientoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(600)", Nullable: "Y", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CR.cat_TipoFuentesFinanciamiento", Type: "Clustered", Columns: ["TipoFuenteFinanciamientoId"] }
        ]
    }
    , {
        TableName: "[CR].[cat_TipoOrganizacion]", Description: ""
        , Coumns: [
            { Name: "TipoOrganizacionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(100)", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(600)", Nullable: "Y", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CR.cat_TipoOrganizacion", Type: "Clustered", Columns: ["TipoOrganizacionId"] }
        ]
    }
    , {
        TableName: "[CR].[cat_TipoProductoServicio]", Description: ""
        , Coumns: [
            { Name: "TipoProductoServicioId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(600)", Nullable: "Y", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CR.cat_TipoProductoServicio", Type: "Clustered", Columns: ["TipoProductoServicioId"] }
        ]
    }
    , {
        TableName: "[CR].[cat_TipoRelacion]", Description: ""
        , Coumns: [
            { Name: "TipoRelacionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(600)", Nullable: "Y", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CR.cat_TipoRelacion", Type: "Clustered", Columns: ["TipoRelacionId"] }
        ]
    }
    , {
        TableName: "[CR].[cat_TituloPersona]", Description: ""
        , Coumns: [
            { Name: "TituloId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(600)", Nullable: "Y", Description: "" }
            , { Name: "FechaRegistro", Datatype: "NVARCHAR(-1)", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(-1)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CR.cat_TituloPersona", Type: "Clustered", Columns: ["TituloId"] }
        ]
    }
    , {
        TableName: "[CR].[Menu]", Description: ""
        , Coumns: [
            { Name: "MenuId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "MenuName", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CR.Menu", Type: "Clustered", Columns: ["MenuId"] }
        ]
    }
    , {
        TableName: "[CR].[MenuItem]", Description: ""
        , Coumns: [
            { Name: "MenuItemId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "MenuText", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "LinkUrl", Datatype: "NVARCHAR(510)", Nullable: "Y", Description: "" }
            , { Name: "MenuOrder", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "ParentMenuItemId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "MenuId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.MenuItem_CR.Menu_MenuId", Column: "MenuId", ReferenceTo: "[Menu].[MenuId]" }
            , { Name: "FK_CR.MenuItem_CR.MenuItem_ParentMenuItemId", Column: "ParentMenuItemId", ReferenceTo: "[MenuItem].[MenuItemId]" }
        ]
        , Indexes: [
            { Name: "IX_MenuId", Type: "Nonclustered", Columns: ["MenuId"] }
            , { Name: "IX_ParentMenuItemId", Type: "Nonclustered", Columns: ["ParentMenuItemId"] }
            , { Name: "PK_CR.MenuItem", Type: "Clustered", Columns: ["MenuItemId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_ActividadAdicional]", Description: ""
        , Coumns: [
            { Name: "ActividadAdicionalId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(600)", Nullable: "Y", Description: "" }
            , { Name: "FechaActividad", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "AliadoId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.tab_ActividadAdicional_CR.tab_Aliado_AliadoId", Column: "AliadoId", ReferenceTo: "[tab_Aliado].[AliadoId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_Activ__Aliad__4EE89E87", Column: "AliadoId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_AliadoId", Type: "Nonclustered", Columns: ["AliadoId"] }
            , { Name: "PK_CR.tab_ActividadAdicional", Type: "Clustered", Columns: ["ActividadAdicionalId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_AdjuntoPorCompetidor]", Description: ""
        , Coumns: [
            { Name: "AdjuntoPorCompetidorId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "N", Description: "" }
            , { Name: "CompetidorId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Tarifa", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "VTC", Datatype: "BIT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.tab_AdjuntoPorCompetidor_CR.tab_Competidor_CompetidorId", Column: "CompetidorId", ReferenceTo: "[tab_Competidor].[CompetidorId]" }
            , { Name: "FK_CR.tab_AdjuntoPorCompetidor_GEN.Adjunto_AdjuntoId", Column: "AdjuntoId", ReferenceTo: "[Adjunto].[AdjuntoId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_Adjun__Adjun__35C7EB02", Column: "AdjuntoId", Value: "((0))" }
            , { Name: "DF__tab_Adjun__Compe__36BC0F3B", Column: "CompetidorId", Value: "((0))" }
            , { Name: "DF__tab_Adjun__Tarif__40306ADC", Column: "Tarifa", Value: "((0))" }
            , { Name: "DF__tab_Adjunto__VTC__41248F15", Column: "VTC", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_AdjuntoId", Type: "Nonclustered", Columns: ["AdjuntoId"] }
            , { Name: "IX_CompetidorId", Type: "Nonclustered", Columns: ["CompetidorId"] }
            , { Name: "PK_CR.tab_AdjuntoPorCompetidor", Type: "Clustered", Columns: ["AdjuntoPorCompetidorId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_AdjuntoPorConvenio]", Description: ""
        , Coumns: [
            { Name: "AdjuntoPorConvenioId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "N", Description: "" }
            , { Name: "ConvenioId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.tab_AdjuntoPorConvenio_CR.tab_Convenio_ConvenioId", Column: "ConvenioId", ReferenceTo: "[tab_Convenio].[ConvenioId]" }
            , { Name: "FK_CR.tab_AdjuntoPorConvenio_GEN.Adjunto_AdjuntoId", Column: "AdjuntoId", ReferenceTo: "[Adjunto].[AdjuntoId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_Adjun__Adjun__4FDCC2C0", Column: "AdjuntoId", Value: "((0))" }
            , { Name: "DF__tab_Adjun__Conve__50D0E6F9", Column: "ConvenioId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_AdjuntoId", Type: "Nonclustered", Columns: ["AdjuntoId"] }
            , { Name: "IX_ConvenioId", Type: "Nonclustered", Columns: ["ConvenioId"] }
            , { Name: "PK_CR.tab_AdjuntoPorConvenio", Type: "Clustered", Columns: ["AdjuntoPorConvenioId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_AdjuntoPorConvocatoria]", Description: ""
        , Coumns: [
            { Name: "AdjuntoPorConvocatoriaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "N", Description: "" }
            , { Name: "ConvocatoriaId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.AdjuntoPorConvocatoria_CR.Convocatoria_ConvocatoriaId", Column: "ConvocatoriaId", ReferenceTo: "[tab_Convocatoria].[ConvocatoriaId]" }
            , { Name: "FK_CR.AdjuntoPorConvocatoria_GEN.Adjunto_AdjuntoId", Column: "AdjuntoId", ReferenceTo: "[Adjunto].[AdjuntoId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__AdjuntoPo__Adjun__53C2623D", Column: "AdjuntoId", Value: "((0))" }
            , { Name: "DF__AdjuntoPo__Convo__54B68676", Column: "ConvocatoriaId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_AdjuntoId", Type: "Nonclustered", Columns: ["AdjuntoId"] }
            , { Name: "IX_ConvocatoriaId", Type: "Nonclustered", Columns: ["ConvocatoriaId"] }
            , { Name: "PK_CR.AdjuntoPorConvocatoria", Type: "Clustered", Columns: ["AdjuntoPorConvocatoriaId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_AdjuntoPorOportunidad]", Description: ""
        , Coumns: [
            { Name: "AdjuntoPorOportunidadId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "N", Description: "" }
            , { Name: "OportunidadNegocioId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.tab_AdjuntoPorOportunidad_CR.tab_OportunidadNegocios_OportunidadNegocioId", Column: "OportunidadNegocioId", ReferenceTo: "[tab_OportunidadNegocios].[OportunidadNegocioId]" }
            , { Name: "FK_CR.tab_AdjuntoPorOportunidad_GEN.Adjunto_AdjuntoId", Column: "AdjuntoId", ReferenceTo: "[Adjunto].[AdjuntoId]" }
        ]
        , Indexes: [
            { Name: "IX_AdjuntoId", Type: "Nonclustered", Columns: ["AdjuntoId"] }
            , { Name: "IX_OportunidadNegocioId", Type: "Nonclustered", Columns: ["OportunidadNegocioId"] }
            , { Name: "PK_CR.tab_AdjuntoPorOportunidad", Type: "Clustered", Columns: ["AdjuntoPorOportunidadId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_Aliado]", Description: ""
        , Coumns: [
            { Name: "AliadoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(600)", Nullable: "Y", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "EmpresaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ContactoId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.tab_Aliado_CR.cat_Contactos_ContactoId", Column: "ContactoId", ReferenceTo: "[cat_Contactos].[ContactoId]" }
            , { Name: "FK_CR.tab_Aliado_CR.cat_Empresas_EmpresaId", Column: "EmpresaId", ReferenceTo: "[cat_Empresas].[EmpresaId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_Aliad__Conta__78DED853", Column: "ContactoId", Value: "((0))" }
            , { Name: "DF__tab_Aliad__Empre__5E2AE217", Column: "EmpresaId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_ContactoId", Type: "Nonclustered", Columns: ["ContactoId"] }
            , { Name: "IX_EmpresaId", Type: "Nonclustered", Columns: ["EmpresaId"] }
            , { Name: "PK_CR.tab_Aliado", Type: "Clustered", Columns: ["AliadoId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_AreaActividadAdicional]", Description: ""
        , Coumns: [
            { Name: "AreaActividadAdicionalId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "ActividadAdicionalId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClaveUnidad", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.tab_AreaActividadAdicional_CR.tab_ActividadAdicional_ActividadAdicionalId", Column: "ActividadAdicionalId", ReferenceTo: "[tab_ActividadAdicional].[ActividadAdicionalId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_AreaA__Activ__51C50B32", Column: "ActividadAdicionalId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_ActividadAdicionalId", Type: "Nonclustered", Columns: ["ActividadAdicionalId"] }
            , { Name: "PK_CR.tab_AreaActividadAdicional", Type: "Clustered", Columns: ["AreaActividadAdicionalId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_AreaConvenio]", Description: ""
        , Coumns: [
            { Name: "AreaConvenioId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "ConvenioId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClaveUnidad", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.tab_AreaConvenio_CR.tab_Convenio_ConvenioId", Column: "ConvenioId", ReferenceTo: "[tab_Convenio].[ConvenioId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_AreaC__Conve__52B92F6B", Column: "ConvenioId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_ConvenioId", Type: "Nonclustered", Columns: ["ConvenioId"] }
            , { Name: "PK_CR.tab_AreaConvenio", Type: "Clustered", Columns: ["AreaConvenioId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_AutoresEstudioMercado]", Description: ""
        , Coumns: [
            { Name: "AutoresEstudioMercadoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "EstudiosMercadoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "NombrePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CR.tab_AutoresEstudioMercado", Type: "Clustered", Columns: ["AutoresEstudioMercadoId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_BitacoraON]", Description: ""
        , Coumns: [
            { Name: "BitacoraOportunidadNegocioId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "OportunidadNegocioId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ComentarioPersona", Datatype: "NVARCHAR(1000)", Nullable: "Y", Description: "" }
            , { Name: "ComentarioSistema", Datatype: "NVARCHAR(1000)", Nullable: "Y", Description: "" }
            , { Name: "EstadoFlujo", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "EstadoFlujoONId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "ClaveUnidad", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "Especialista", Datatype: "NVARCHAR(1000)", Nullable: "Y", Description: "" }
            , { Name: "Investigador", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Comentarios", Datatype: "VARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.tab_BitacoraON_CR.tab_EstadoFlujoON_EstadoFlujoONId", Column: "EstadoFlujoONId", ReferenceTo: "[tab_EstadoFlujoON].[EstadoFlujoONId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_Bitac__Estad__4400FBC0", Column: "EstadoFlujo", Value: "((0))" }
            , { Name: "DF__tab_Bitac__Fecha__46DD686B", Column: "FechaRegistro", Value: "('1900-01-01T00:00:00.000')" }
        ]
        , Indexes: [
            { Name: "IX_EstadoFlujoONId", Type: "Nonclustered", Columns: ["EstadoFlujoONId"] }
            , { Name: "PK_CR.tBitacoraON", Type: "Clustered", Columns: ["BitacoraOportunidadNegocioId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_Competidor]", Description: ""
        , Coumns: [
            { Name: "CompetidorId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Clave", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "TipoCompetidor", Datatype: "NVARCHAR(40)", Nullable: "Y", Description: "" }
            , { Name: "PosicionamientoTec", Datatype: "NVARCHAR(40)", Nullable: "Y", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(600)", Nullable: "Y", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "EmpresaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "LineaDesarrolloTecnologicoId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "SegmentoMercadoId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "TamanoEmpresaId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "TipoAccesoVTC", Datatype: "NVARCHAR(40)", Nullable: "Y", Description: "" }
            , { Name: "ClaveUnidad", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.tab_Competidor_CR.cat_Empresas_EmpresaId", Column: "EmpresaId", ReferenceTo: "[cat_Empresas].[EmpresaId]" }
            , { Name: "FK_CR.tab_Competidor_CR.cat_LineaDesarrolloTecnologico_LineaDesarrolloTecnologicoId", Column: "LineaDesarrolloTecnologicoId", ReferenceTo: "[cat_LineaDesarrolloTecnologico].[LineaDesarrolloTecnologicoId]" }
            , { Name: "FK_CR.tab_Competidor_CR.cat_SegmentoMercado_SegmentoMercadoId", Column: "SegmentoMercadoId", ReferenceTo: "[cat_SegmentoMercado].[SegmentoMercadoId]" }
            , { Name: "FK_CR.tab_Competidor_CR.cat_TamanoEmpresa_TamanoEmpresaId", Column: "TamanoEmpresaId", ReferenceTo: "[cat_TamanoEmpresa].[TamanoEmpresaId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_Compe__Empre__37B03374", Column: "EmpresaId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_EmpresaId", Type: "Nonclustered", Columns: ["EmpresaId"] }
            , { Name: "IX_LineaDesarrolloTecnologicoId", Type: "Nonclustered", Columns: ["LineaDesarrolloTecnologicoId"] }
            , { Name: "IX_SegmentoMercadoId", Type: "Nonclustered", Columns: ["SegmentoMercadoId"] }
            , { Name: "IX_TamanoEmpresaId", Type: "Nonclustered", Columns: ["TamanoEmpresaId"] }
            , { Name: "PK_CR.tab_Competidor", Type: "Clustered", Columns: ["CompetidorId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_ContactoPorConvocatoria]", Description: ""
        , Coumns: [
            { Name: "ContactoPorConvocatoriaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "ConvocatoriaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ContactoId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.ContactoPorConvocatoria_CR.cat_Contactos_ContactoId", Column: "ContactoId", ReferenceTo: "[cat_Contactos].[ContactoId]" }
            , { Name: "FK_CR.ContactoPorConvocatoria_CR.Convocatoria_ConvocatoriaId", Column: "ConvocatoriaId", ReferenceTo: "[tab_Convocatoria].[ConvocatoriaId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__ContactoP__Conta__569ECEE8", Column: "ContactoId", Value: "((0))" }
            , { Name: "DF__ContactoP__Convo__55AAAAAF", Column: "ConvocatoriaId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_ContactoId", Type: "Nonclustered", Columns: ["ContactoId"] }
            , { Name: "IX_ConvocatoriaId", Type: "Nonclustered", Columns: ["ConvocatoriaId"] }
            , { Name: "PK_CR.ContactoPorConvocatoria", Type: "Clustered", Columns: ["ContactoPorConvocatoriaId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_ContactosPerfil]", Description: ""
        , Coumns: [
            { Name: "ContactoPerfilId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "GradoAcademicoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "CarreraId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "InstitucionID", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "PaisID", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaInicio", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "FechaFinal", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "ContactoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Especialidad", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.tbl_ContactosPerfil_CH.cat_Carreras_CarreraId", Column: "CarreraId", ReferenceTo: "[cat_Carreras].[CarreraId]" }
            , { Name: "FK_CR.tbl_ContactosPerfil_CH.cat_GradoAcademico_GradoAcademicoId", Column: "GradoAcademicoId", ReferenceTo: "[cat_GradoAcademico].[GradoAcademicoId]" }
            , { Name: "FK_CR.tbl_ContactosPerfil_CH.cat_Instituciones_InstitucionID", Column: "InstitucionID", ReferenceTo: "[cat_Instituciones].[InstitucionID]" }
            , { Name: "FK_CR.tbl_ContactosPerfil_CH.cat_Pais_PaisID", Column: "PaisID", ReferenceTo: "[cat_Pais].[PaisID]" }
            , { Name: "FK_CR.tbl_ContactosPerfil_CR.cat_Contactos_ContactoId", Column: "ContactoId", ReferenceTo: "[cat_Contactos].[ContactoId]" }
        ]
        , Indexes: [
            { Name: "IX_CarreraId", Type: "Nonclustered", Columns: ["CarreraId"] }
            , { Name: "IX_ContactoId", Type: "Nonclustered", Columns: ["ContactoId"] }
            , { Name: "IX_GradoAcademicoId", Type: "Nonclustered", Columns: ["GradoAcademicoId"] }
            , { Name: "IX_InstitucionID", Type: "Nonclustered", Columns: ["InstitucionID"] }
            , { Name: "IX_PaisID", Type: "Nonclustered", Columns: ["PaisID"] }
            , { Name: "PK_CR.tbl_ContactosPerfil", Type: "Clustered", Columns: ["ContactoPerfilId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_ContactosPuesto]", Description: ""
        , Coumns: [
            { Name: "ContactoPuestoHistoricoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Puesto", Datatype: "NVARCHAR(-1)", Nullable: "N", Description: "" }
            , { Name: "EmpresaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaInicio", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "FechaFinal", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "ContactoId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.tab_ContactosPerfil_CR.cat_Contactos_ContactoId", Column: "ContactoId", ReferenceTo: "[cat_Contactos].[ContactoId]" }
            , { Name: "FK_CR.tab_ContactosPerfil_CR.cat_Empresas_EmpresaId", Column: "EmpresaId", ReferenceTo: "[cat_Empresas].[EmpresaId]" }
        ]
        , Indexes: [
            { Name: "IX_ContactoId", Type: "Nonclustered", Columns: ["ContactoId"] }
            , { Name: "IX_EmpresaId", Type: "Nonclustered", Columns: ["EmpresaId"] }
            , { Name: "PK_CR.tab_ContactosPerfil", Type: "Clustered", Columns: ["ContactoPuestoHistoricoId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_Convenio]", Description: ""
        , Coumns: [
            { Name: "ConvenioId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ObjetoConvenio", Datatype: "NVARCHAR(600)", Nullable: "Y", Description: "" }
            , { Name: "NoConvenio", Datatype: "NVARCHAR(40)", Nullable: "Y", Description: "" }
            , { Name: "FechaInicio", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "FechaTermino", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "TipoAcceso", Datatype: "NVARCHAR(30)", Nullable: "Y", Description: "" }
            , { Name: "Firma", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "TipoConvenioId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "AliadoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "AmbitoConvId", Datatype: "INT", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.tab_Convenio_CR.cat_AmbitoConv_AmbitoConvId", Column: "AmbitoConvId", ReferenceTo: "[cat_AmbitoConv].[AmbitoConvId]" }
            , { Name: "FK_CR.tab_Convenio_CR.cat_TipoConvenio_TipoConvenioId", Column: "TipoConvenioId", ReferenceTo: "[cat_TipoConvenio].[ConvenioId]" }
            , { Name: "FK_CR.tab_Convenio_CR.tab_Aliado_AliadoId", Column: "AliadoId", ReferenceTo: "[tab_Aliado].[AliadoId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_Conve__Aliad__54A177DD", Column: "AliadoId", Value: "((0))" }
            , { Name: "DF__tab_Conve__TipoC__53AD53A4", Column: "TipoConvenioId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_AliadoId", Type: "Nonclustered", Columns: ["AliadoId"] }
            , { Name: "IX_AmbitoConvId", Type: "Nonclustered", Columns: ["AmbitoConvId"] }
            , { Name: "IX_TipoConvenioId", Type: "Nonclustered", Columns: ["TipoConvenioId"] }
            , { Name: "PK_CR.tab_Convenio", Type: "Clustered", Columns: ["ConvenioId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_Convocatoria]", Description: ""
        , Coumns: [
            { Name: "ConvocatoriaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Clave", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NombreConvocatoria", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(600)", Nullable: "Y", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "FechaInicio", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "FechaTermino", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "FondoProgramaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "LeccionesAprendidas", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.Convocatoria_CR.FondoPrograma_FondoProgramaId", Column: "FondoProgramaId", ReferenceTo: "[tab_FondoPrograma].[FondoProgramaId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__Convocato__Fondo__5792F321", Column: "FondoProgramaId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_FondoProgramaId", Type: "Nonclustered", Columns: ["FondoProgramaId"] }
            , { Name: "PK_CR.Convocatoria", Type: "Clustered", Columns: ["ConvocatoriaId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_EstadoFlujoON]", Description: ""
        , Coumns: [
            { Name: "EstadoFlujoONId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(500)", Nullable: "Y", Description: "" }
            , { Name: "DescripcionCorta", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CR.tab_EstadoFlujoON", Type: "Clustered", Columns: ["EstadoFlujoONId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_EstadoON]", Description: ""
        , Coumns: [
            { Name: "EstadoONId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(500)", Nullable: "Y", Description: "" }
            , { Name: "DescripcionCorta", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_dbo.tab_EstadoON", Type: "Clustered", Columns: ["EstadoONId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_EstudiosMercado]", Description: ""
        , Coumns: [
            { Name: "EstudiosMercadoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Tema", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Fecha", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "ProyectoId", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "ClaveUnidad", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "Acceso", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.tab_EstudiosMercado_GEN.Adjunto_AdjuntoId", Column: "AdjuntoId", ReferenceTo: "[Adjunto].[AdjuntoId]" }
        ]
        , Indexes: [
            { Name: "IX_AdjuntoId", Type: "Nonclustered", Columns: ["AdjuntoId"] }
            , { Name: "PK_CR.tab_EstudiosMercado", Type: "Clustered", Columns: ["EstudiosMercadoId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_Eventos]", Description: ""
        , Coumns: [
            { Name: "EventoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NombreEvento", Datatype: "NVARCHAR(500)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "TipoEventoONId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Ciudad", Datatype: "NVARCHAR(500)", Nullable: "Y", Description: "" }
            , { Name: "FechaEvento", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "ClaveEmpleado", Datatype: "NVARCHAR(500)", Nullable: "Y", Description: "" }
            , { Name: "RegistroEmpleado", Datatype: "NVARCHAR(500)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.tab_Eventos_CR.tab_TiposEventos_TipoEventoONId", Column: "TipoEventoONId", ReferenceTo: "[tab_TiposEventos].[TipoEventoONId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_Event__Fecha__2799C73C", Column: "FechaEvento", Value: "('1900-01-01T00:00:00.000')" }
            , { Name: "DF__tab_Event__TipoE__26A5A303", Column: "TipoEventoONId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_TipoEventoONId", Type: "Nonclustered", Columns: ["TipoEventoONId"] }
            , { Name: "PK_CR.tab_Eventos", Type: "Clustered", Columns: ["EventoId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_FondoPrograma]", Description: ""
        , Coumns: [
            { Name: "FondoProgramaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Clave", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NombreFP", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(600)", Nullable: "Y", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "EmpresaId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "ContactoId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "SitioWebFondoProgramaId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "FuenteFinanciamientoId", Datatype: "INT", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.FondoPrograma_CR.cat_Contactos_ContactoId", Column: "ContactoId", ReferenceTo: "[cat_Contactos].[ContactoId]" }
            , { Name: "FK_CR.FondoPrograma_CR.cat_Empresas_EmpresaId", Column: "EmpresaId", ReferenceTo: "[cat_Empresas].[EmpresaId]" }
            , { Name: "FK_CR.FondoPrograma_CR.FuenteFinanciamiento_FuenteFinanciamientoId", Column: "FuenteFinanciamientoId", ReferenceTo: "[tab_FuenteFinanciamiento].[FuenteFinanciamientoId]" }
        ]
        , Indexes: [
            { Name: "IX_ContactoId", Type: "Nonclustered", Columns: ["ContactoId"] }
            , { Name: "IX_EmpresaId", Type: "Nonclustered", Columns: ["EmpresaId"] }
            , { Name: "IX_FuenteFinanciamientoId", Type: "Nonclustered", Columns: ["FuenteFinanciamientoId"] }
            , { Name: "IX_SitioWebFondoProgramaId", Type: "Nonclustered", Columns: ["SitioWebFondoProgramaId"] }
            , { Name: "PK_CR.FondoPrograma", Type: "Clustered", Columns: ["FondoProgramaId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_FuenteFinanciamiento]", Description: ""
        , Coumns: [
            { Name: "FuenteFinanciamientoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Clave", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NombreFF", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(600)", Nullable: "Y", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "SitioWeb", Datatype: "NVARCHAR(600)", Nullable: "Y", Description: "" }
            , { Name: "TipoFuenteFinanciamientoId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "PaisId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "OrigenDatos", Datatype: "NVARCHAR(40)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.FuenteFinanciamiento_CH.cat_Pais_PaisId", Column: "PaisId", ReferenceTo: "[cat_Pais].[PaisID]" }
            , { Name: "FK_CR.FuenteFinanciamiento_CR.cat_TipoFuentesFinanciamiento_TipoFuenteFinanciamientoId", Column: "TipoFuenteFinanciamientoId", ReferenceTo: "[cat_TipoFuentesFinanciamiento].[TipoFuenteFinanciamientoId]" }
        ]
        , Indexes: [
            { Name: "IX_PaisId", Type: "Nonclustered", Columns: ["PaisId"] }
            , { Name: "IX_TipoFuenteFinanciamientoId", Type: "Nonclustered", Columns: ["TipoFuenteFinanciamientoId"] }
            , { Name: "PK_CR.FuenteFinanciamiento", Type: "Clustered", Columns: ["FuenteFinanciamientoId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_GrupoColegiadoPartInt]", Description: ""
        , Coumns: [
            { Name: "GrupoColegiadoPartIntId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Clave", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(600)", Nullable: "Y", Description: "" }
            , { Name: "Calle", Datatype: "NVARCHAR(500)", Nullable: "Y", Description: "" }
            , { Name: "Colonia", Datatype: "NVARCHAR(500)", Nullable: "Y", Description: "" }
            , { Name: "CP", Datatype: "NVARCHAR(10)", Nullable: "Y", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "ContactoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NaturalezaInteraccionId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "EstadoId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "MunicipioId", Datatype: "INT", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.tab_GrupoColegiadoPartInt_CR.cat_Contactos_ContactoId", Column: "ContactoId", ReferenceTo: "[cat_Contactos].[ContactoId]" }
            , { Name: "FK_CR.tab_GrupoColegiadoPartInt_CR.cat_NaturalezaInteraccion_NaturalezaInteraccionId", Column: "NaturalezaInteraccionId", ReferenceTo: "[cat_NaturalezaInteraccion].[NaturalezaInteraccionId]" }
            , { Name: "FK_CR.tab_GrupoColegiadoPartInt_GEN.cat_Estados_EstadoId", Column: "EstadoId", ReferenceTo: "[cat_Estados].[EstadoId]" }
            , { Name: "FK_CR.tab_GrupoColegiadoPartInt_GEN.cat_Municipios_MunicipioId", Column: "MunicipioId", ReferenceTo: "[cat_Municipios].[MunicipioId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_Grupo__Conta__2779CBAB", Column: "ContactoId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_ContactoId", Type: "Nonclustered", Columns: ["ContactoId"] }
            , { Name: "IX_EstadoId", Type: "Nonclustered", Columns: ["EstadoId"] }
            , { Name: "IX_MunicipioId", Type: "Nonclustered", Columns: ["MunicipioId"] }
            , { Name: "IX_NaturalezaInteraccionId", Type: "Nonclustered", Columns: ["NaturalezaInteraccionId"] }
            , { Name: "PK_CR.tab_GrupoColegiadoPartInt", Type: "Clustered", Columns: ["GrupoColegiadoPartIntId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_IntegranteGrupoColegiadoExterno]", Description: ""
        , Coumns: [
            { Name: "IntegranteGrupoColegiadoExternoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "CargoGC", Datatype: "NVARCHAR(100)", Nullable: "N", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "GrupoColegiadoPartIntId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ContactoId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.tab_IntegranteGrupoColegiadoExterno_CR.cat_Contactos_ContactoId", Column: "ContactoId", ReferenceTo: "[cat_Contactos].[ContactoId]" }
            , { Name: "FK_CR.tab_IntegranteGrupoColegiadoExterno_CR.tab_GrupoColegiadoPartInt_GrupoColegiadoPartIntId", Column: "GrupoColegiadoPartIntId", ReferenceTo: "[tab_GrupoColegiadoPartInt].[GrupoColegiadoPartIntId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_Integ__Conta__2962141D", Column: "ContactoId", Value: "((0))" }
            , { Name: "DF__tab_Integ__Grupo__286DEFE4", Column: "GrupoColegiadoPartIntId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_ContactoId", Type: "Nonclustered", Columns: ["ContactoId"] }
            , { Name: "IX_GrupoColegiadoPartIntId", Type: "Nonclustered", Columns: ["GrupoColegiadoPartIntId"] }
            , { Name: "PK_CR.tab_IntegranteGrupoColegiadoExterno", Type: "Clustered", Columns: ["IntegranteGrupoColegiadoExternoId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_OportunidadNegocios]", Description: ""
        , Coumns: [
            { Name: "OportunidadNegocioId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NombreOportunidad", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "FechaMaximaAtencion", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "EventoId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "ContactoId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "Fecha", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "ClaveEmpleado", Datatype: "NVARCHAR(500)", Nullable: "Y", Description: "" }
            , { Name: "TipoEventoONId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "MedioComunicacion", Datatype: "NVARCHAR(500)", Nullable: "Y", Description: "" }
            , { Name: "Notificar", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "empresaId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(500)", Nullable: "Y", Description: "" }
            , { Name: "DescripcionMedioContacto", Datatype: "NVARCHAR(500)", Nullable: "Y", Description: "" }
            , { Name: "EstadoFlujoONId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "Especialista", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "Responsable", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "Investigador", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "ComentariosEspecialista", Datatype: "VARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "ClaveUnidad", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "ComentariosResponsable", Datatype: "VARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "ComentariosInvestigador", Datatype: "VARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "EstadoONId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "FechaReactivacion", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "NoIniciativa", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "NoPropuesta", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "TituloPropuesta", Datatype: "VARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "PorQueSuspende", Datatype: "VARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "PorQueCancela", Datatype: "VARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "ComentariosAdministrador", Datatype: "VARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.tab_OportunidadNegocios_CR.cat_Contactos_ContactoId", Column: "ContactoId", ReferenceTo: "[cat_Contactos].[ContactoId]" }
            , { Name: "FK_CR.tab_OportunidadNegocios_CR.cat_Empresas_empresaId", Column: "empresaId", ReferenceTo: "[cat_Empresas].[EmpresaId]" }
            , { Name: "FK_CR.tab_OportunidadNegocios_CR.tab_EstadoFlujoON_EstadoFlujoONId", Column: "EstadoFlujoONId", ReferenceTo: "[tab_EstadoFlujoON].[EstadoFlujoONId]" }
            , { Name: "FK_CR.tab_OportunidadNegocios_CR.tab_Eventos_EventoId", Column: "EventoId", ReferenceTo: "[tab_Eventos].[EventoId]" }
            , { Name: "FK_CR.tab_OportunidadNegocios_CR.tab_TiposEventos_TipoEventoONId", Column: "TipoEventoONId", ReferenceTo: "[tab_TiposEventos].[TipoEventoONId]" }
            , { Name: "FK_CR.tab_OportunidadNegocios_dbo.EstadoON_EstadoONId", Column: "EstadoONId", ReferenceTo: "[tab_EstadoON].[EstadoONId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_Oport__Fecha__099F5001", Column: "FechaReactivacion", Value: "('1900-01-01T00:00:00.000')" }
            , { Name: "DF__tab_Oport__Notif__48FABB07", Column: "Notificar", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_ContactoId", Type: "Nonclustered", Columns: ["ContactoId"] }
            , { Name: "IX_empresaId", Type: "Nonclustered", Columns: ["empresaId"] }
            , { Name: "IX_EstadoFlujoONId", Type: "Nonclustered", Columns: ["EstadoFlujoONId"] }
            , { Name: "IX_EstadoONId", Type: "Nonclustered", Columns: ["EstadoONId"] }
            , { Name: "IX_EventoId", Type: "Nonclustered", Columns: ["EventoId"] }
            , { Name: "IX_TipoEventoONId", Type: "Nonclustered", Columns: ["TipoEventoONId"] }
            , { Name: "PK_CR.tab_OportunidadNegocios", Type: "Clustered", Columns: ["OportunidadNegocioId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_PersonalActividadAdicional]", Description: ""
        , Coumns: [
            { Name: "PersonalActividadAdicionalId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "ActividadAdicionalId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.tab_PersonalActividadAdicional_CR.tab_ActividadAdicional_ActividadAdicionalId", Column: "ActividadAdicionalId", ReferenceTo: "[tab_ActividadAdicional].[ActividadAdicionalId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_Perso__Activ__55959C16", Column: "ActividadAdicionalId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_ActividadAdicionalId", Type: "Nonclustered", Columns: ["ActividadAdicionalId"] }
            , { Name: "PK_CR.tab_PersonalActividadAdicional", Type: "Clustered", Columns: ["PersonalActividadAdicionalId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_PersonaPartInt]", Description: ""
        , Coumns: [
            { Name: "PersonaPartIntId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(600)", Nullable: "Y", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "ContactoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NaturalezaInteraccionId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.tab_PersonaPartInt_CR.cat_Contactos_ContactoId", Column: "ContactoId", ReferenceTo: "[cat_Contactos].[ContactoId]" }
            , { Name: "FK_CR.tab_PersonaPartInt_CR.cat_NaturalezaInteraccion_NaturalezaInteraccionId", Column: "NaturalezaInteraccionId", ReferenceTo: "[cat_NaturalezaInteraccion].[NaturalezaInteraccionId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_Perso__Conta__2A563856", Column: "ContactoId", Value: "((0))" }
            , { Name: "DF__tab_Perso__Natur__2B4A5C8F", Column: "NaturalezaInteraccionId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_ContactoId", Type: "Nonclustered", Columns: ["ContactoId"] }
            , { Name: "IX_NaturalezaInteraccionId", Type: "Nonclustered", Columns: ["NaturalezaInteraccionId"] }
            , { Name: "PK_CR.tab_PersonaPartInt", Type: "Clustered", Columns: ["PersonaPartIntId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_ProductoPorCompetidor]", Description: ""
        , Coumns: [
            { Name: "ProductoPorCompetidorId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "ProductoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "CompetidorId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.tab_ProductoPorCompetidor_CR.cat_Producto_ProductoId", Column: "ProductoId", ReferenceTo: "[cat_Producto].[ProductoId]" }
            , { Name: "FK_CR.tab_ProductoPorCompetidor_CR.tab_Competidor_CompetidorId", Column: "CompetidorId", ReferenceTo: "[tab_Competidor].[CompetidorId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_Produ__Compe__39987BE6", Column: "CompetidorId", Value: "((0))" }
            , { Name: "DF__tab_Produ__Produ__38A457AD", Column: "ProductoId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_CompetidorId", Type: "Nonclustered", Columns: ["CompetidorId"] }
            , { Name: "IX_ProductoId", Type: "Nonclustered", Columns: ["ProductoId"] }
            , { Name: "PK_CR.tab_ProductoPorCompetidor", Type: "Clustered", Columns: ["ProductoPorCompetidorId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_ProductoPorProveedor]", Description: ""
        , Coumns: [
            { Name: "ProductoPorProveedorId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CR.tab_ProductoPorProveedor", Type: "Clustered", Columns: ["ProductoPorProveedorId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_PropuestaPorConvocatoria]", Description: ""
        , Coumns: [
            { Name: "PropuestaPorConvocatoriaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "EdoProp", Datatype: "NVARCHAR(60)", Nullable: "Y", Description: "" }
            , { Name: "ConvocatoriaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "PropuestaId", Datatype: "NVARCHAR(50)", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.tab_PropuestaPorConvocatoria_CR.tab_Convocatoria_ConvocatoriaId", Column: "ConvocatoriaId", ReferenceTo: "[tab_Convocatoria].[ConvocatoriaId]" }
            , { Name: "FK_CR.tab_PropuestaPorConvocatoria_GEN.Propuestas_PropuestaId", Column: "PropuestaId", ReferenceTo: "[Propuestas].[PropuestaId]" }
        ]
        , Indexes: [
            { Name: "IX_ConvocatoriaId", Type: "Nonclustered", Columns: ["ConvocatoriaId"] }
            , { Name: "IX_PropuestaId", Type: "Nonclustered", Columns: ["PropuestaId"] }
            , { Name: "PK_CR.tab_PropuestaPorConvocatoria", Type: "Clustered", Columns: ["PropuestaPorConvocatoriaId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_Proveedor]", Description: ""
        , Coumns: [
            { Name: "ProveedorId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Clave", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(600)", Nullable: "Y", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "EmpresaId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.tab_Proveedor_CR.cat_Empresas_EmpresaId", Column: "EmpresaId", ReferenceTo: "[cat_Empresas].[EmpresaId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_Prove__Empre__1FD8A9E3", Column: "EmpresaId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_EmpresaId", Type: "Nonclustered", Columns: ["EmpresaId"] }
            , { Name: "PK_CR.tab_Proveedor", Type: "Clustered", Columns: ["ProveedorId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_ProyectoPorConvocatoria]", Description: ""
        , Coumns: [
            { Name: "ProyectoPorConvocatoriaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "EdoProyecto", Datatype: "NVARCHAR(60)", Nullable: "Y", Description: "" }
            , { Name: "ConvocatoriaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ProyectoId", Datatype: "NVARCHAR(20)", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.tab_ProyectoPorConvocatoria_CR.tab_Convocatoria_ConvocatoriaId", Column: "ConvocatoriaId", ReferenceTo: "[tab_Convocatoria].[ConvocatoriaId]" }
            , { Name: "FK_CR.tab_ProyectoPorConvocatoria_GEN.Proyectos_ProyectoId", Column: "ProyectoId", ReferenceTo: "[Proyectos].[ProyectoId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_Proye__Convo__3D3402A0", Column: "ConvocatoriaId", Value: "((0))" }
            , { Name: "DF__tab_Proye__Proye__3E2826D9", Column: "ProyectoId", Value: "('')" }
        ]
        , Indexes: [
            { Name: "IX_ConvocatoriaId", Type: "Nonclustered", Columns: ["ConvocatoriaId"] }
            , { Name: "IX_ProyectoId", Type: "Nonclustered", Columns: ["ProyectoId"] }
            , { Name: "PK_CR.tab_ProyectoPorConvocatoria", Type: "Clustered", Columns: ["ProyectoPorConvocatoriaId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_RelacionPorContacto]", Description: ""
        , Coumns: [
            { Name: "RelacionPorContactoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "TipoRelacionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ContactoId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.tab_RelacionPorContacto_CR.cat_Contactos_ContactoId", Column: "ContactoId", ReferenceTo: "[cat_Contactos].[ContactoId]" }
            , { Name: "FK_CR.tab_RelacionPorContacto_CR.cat_TipoRelacion_TipoRelacionId", Column: "TipoRelacionId", ReferenceTo: "[cat_TipoRelacion].[TipoRelacionId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_Relac__Conta__2D32A501", Column: "ContactoId", Value: "((0))" }
            , { Name: "DF__tab_Relac__TipoR__2C3E80C8", Column: "TipoRelacionId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_ContactoId", Type: "Nonclustered", Columns: ["ContactoId"] }
            , { Name: "IX_TipoRelacionId", Type: "Nonclustered", Columns: ["TipoRelacionId"] }
            , { Name: "PK_CR.tab_RelacionPorContacto", Type: "Clustered", Columns: ["RelacionPorContactoId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_RelacionPorEmpresa]", Description: ""
        , Coumns: [
            { Name: "RelacionPorEmpresaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "TipoRelacionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "EmpresaId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.tab_RelacionPorEmpresa_CR.cat_Empresas_EmpresaId", Column: "EmpresaId", ReferenceTo: "[cat_Empresas].[EmpresaId]" }
            , { Name: "FK_CR.tab_RelacionPorEmpresa_CR.cat_TipoRelacion_TipoRelacionId", Column: "TipoRelacionId", ReferenceTo: "[cat_TipoRelacion].[TipoRelacionId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_Relac__Empre__0371755F", Column: "EmpresaId", Value: "((0))" }
            , { Name: "DF__tab_Relac__TipoR__027D5126", Column: "TipoRelacionId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_EmpresaId", Type: "Nonclustered", Columns: ["EmpresaId"] }
            , { Name: "IX_TipoRelacionId", Type: "Nonclustered", Columns: ["TipoRelacionId"] }
            , { Name: "PK_CR.tab_RelacionPorEmpresa", Type: "Clustered", Columns: ["RelacionPorEmpresaId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_SeguimientoON]", Description: ""
        , Coumns: [
            { Name: "SeguimientoOportunidadId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "OportunidadNegocioId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "ClaveUnidad", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "InvestigadorId", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "Actividad", Datatype: "NVARCHAR(1000)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.tab_SeguimientoON_CR.tab_OportunidadNegocios_OportunidadNegocioId", Column: "OportunidadNegocioId", ReferenceTo: "[tab_OportunidadNegocios].[OportunidadNegocioId]" }
        ]
        , Indexes: [
            { Name: "IX_OportunidadNegocioId", Type: "Nonclustered", Columns: ["OportunidadNegocioId"] }
            , { Name: "PK_CR.tab_SeguimientoON", Type: "Clustered", Columns: ["SeguimientoOportunidadId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_ServicioPorCompetidor]", Description: ""
        , Coumns: [
            { Name: "ServicioPorCompetidorId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "ServicioId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "CompetidorId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.tab_ServicioPorCompetidor_CR.cat_Servicio_ServicioId", Column: "ServicioId", ReferenceTo: "[cat_Servicio].[ServicioId]" }
            , { Name: "FK_CR.tab_ServicioPorCompetidor_CR.tab_Competidor_CompetidorId", Column: "CompetidorId", ReferenceTo: "[tab_Competidor].[CompetidorId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_Servi__Compe__3B80C458", Column: "CompetidorId", Value: "((0))" }
            , { Name: "DF__tab_Servi__Servi__3A8CA01F", Column: "ServicioId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_CompetidorId", Type: "Nonclustered", Columns: ["CompetidorId"] }
            , { Name: "IX_ServicioId", Type: "Nonclustered", Columns: ["ServicioId"] }
            , { Name: "PK_CR.tab_ServicioPorCompetidor", Type: "Clustered", Columns: ["ServicioPorCompetidorId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_ServicioPorProveedor]", Description: ""
        , Coumns: [
            { Name: "ServicioPorProveedorId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CR.tab_ServicioPorProveedor", Type: "Clustered", Columns: ["ServicioPorProveedorId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_SitioWebFondoPrograma]", Description: ""
        , Coumns: [
            { Name: "SitioWebFondoProgramaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Url", Datatype: "NVARCHAR(-1)", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(600)", Nullable: "Y", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "FondoProgramaId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.SitioWebFondoPrograma_CR.FondoPrograma_FondoProgramaId", Column: "FondoProgramaId", ReferenceTo: "[tab_FondoPrograma].[FondoProgramaId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__SitioWebF__Fondo__59E54FE7", Column: "FondoProgramaId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_FondoProgramaId", Type: "Nonclustered", Columns: ["FondoProgramaId"] }
            , { Name: "PK_CR.SitioWebFondoPrograma", Type: "Clustered", Columns: ["SitioWebFondoProgramaId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_SitioWebPorConvocatoria]", Description: ""
        , Coumns: [
            { Name: "SitioWebPorConvocatoriaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Url", Datatype: "NVARCHAR(-1)", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(600)", Nullable: "Y", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "ConvocatoriaId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.SitioWebPorConvocatoria_CR.Convocatoria_ConvocatoriaId", Column: "ConvocatoriaId", ReferenceTo: "[tab_Convocatoria].[ConvocatoriaId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__SitioWebP__Convo__5887175A", Column: "ConvocatoriaId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_ConvocatoriaId", Type: "Nonclustered", Columns: ["ConvocatoriaId"] }
            , { Name: "PK_CR.SitioWebPorConvocatoria", Type: "Clustered", Columns: ["SitioWebPorConvocatoriaId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_TematicaPorFondoPrograma]", Description: ""
        , Coumns: [
            { Name: "TematicaPorFondoProgramaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "TematicaId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "FondoProgramaId", Datatype: "INT", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR. TematicaPorFondoPrograma_CR.cat_Tematicas_TematicaId", Column: "TematicaId", ReferenceTo: "[cat_Tematicas].[TematicaId]" }
            , { Name: "FK_CR. TematicaPorFondoPrograma_CR.FondoPrograma_FondoProgramaId", Column: "FondoProgramaId", ReferenceTo: "[tab_FondoPrograma].[FondoProgramaId]" }
        ]
        , Indexes: [
            { Name: "IX_FondoProgramaId", Type: "Nonclustered", Columns: ["FondoProgramaId"] }
            , { Name: "IX_TematicaId", Type: "Nonclustered", Columns: ["TematicaId"] }
            , { Name: "PK_CR. TematicaPorFondoPrograma", Type: "Clustered", Columns: ["TematicaPorFondoProgramaId"] }
        ]
    }
    , {
        TableName: "[CR].[tab_TiposEventos]", Description: ""
        , Coumns: [
            { Name: "TipoEventoONId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NombreEvento", Datatype: "NVARCHAR(400)", Nullable: "N", Description: "" }
            , { Name: "FechaAlta", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_CR.tab_TiposEventos", Type: "Clustered", Columns: ["TipoEventoONId"] }
        ]
    }
    , {
        TableName: "[CR].[UnidadOrganizacionalEmpresas]", Description: ""
        , Coumns: [
            { Name: "ClaveUnidad", Datatype: "NVARCHAR(40)", Nullable: "N", Description: "" }
            , { Name: "FechaEfectiva", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "NombreUnidad", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "padre", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NombreTitular", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "Puesto", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "Correo", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "Telefono", Datatype: "NVARCHAR(60)", Nullable: "Y", Description: "" }
            , { Name: "Ext", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "Celular", Datatype: "NVARCHAR(60)", Nullable: "Y", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(500)", Nullable: "Y", Description: "" }
            , { Name: "Edo", Datatype: "NVARCHAR(500)", Nullable: "Y", Description: "" }
            , { Name: "Munipio", Datatype: "NVARCHAR(500)", Nullable: "Y", Description: "" }
            , { Name: "Colonia", Datatype: "NVARCHAR(500)", Nullable: "Y", Description: "" }
            , { Name: "Calle", Datatype: "NVARCHAR(500)", Nullable: "Y", Description: "" }
            , { Name: "CP", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "PaisId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "EstadoId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "MunicipioId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "EmpresaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "Y", Description: "" }
            , { Name: "ClaveEmpresa", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CR.UnidadOrganizacionalEmpresas_CR.cat_Empresas_EmpresaId", Column: "EmpresaId", ReferenceTo: "[cat_Empresas].[EmpresaId]" }
            , { Name: "FK_CR.UnidadOrganizacionalEmpresas_GEN.Adjunto_AdjuntoId", Column: "AdjuntoId", ReferenceTo: "[Adjunto].[AdjuntoId]" }
            , { Name: "FK_CR.UnidadOrganizacionalEmpresas_GEN.cat_Estados_EstadoId", Column: "EstadoId", ReferenceTo: "[cat_Estados].[EstadoId]" }
            , { Name: "FK_CR.UnidadOrganizacionalEmpresas_GEN.cat_Municipios_MunicipioId", Column: "MunicipioId", ReferenceTo: "[cat_Municipios].[MunicipioId]" }
            , { Name: "FK_CR.UnidadOrganizacionalEmpresas_GEN.cat_Paises_PaisId", Column: "PaisId", ReferenceTo: "[cat_Paises].[PaisId]" }
        ]
        , Indexes: [
            { Name: "IX_AdjuntoId", Type: "Nonclustered", Columns: ["AdjuntoId"] }
            , { Name: "IX_EmpresaId", Type: "Nonclustered", Columns: ["EmpresaId"] }
            , { Name: "IX_EstadoId", Type: "Nonclustered", Columns: ["EstadoId"] }
            , { Name: "IX_MunicipioId", Type: "Nonclustered", Columns: ["MunicipioId"] }
            , { Name: "IX_PaisId", Type: "Nonclustered", Columns: ["PaisId"] }
            , { Name: "PK_CR.UnidadOrganizacionalEmpresas", Type: "Clustered", Columns: ["ClaveUnidad"] }
        ]
    }
    , {
        TableName: "[dbo].[__MigrationHistory]", Description: ""
        , Coumns: [
            { Name: "MigrationId", Datatype: "NVARCHAR(300)", Nullable: "N", Description: "" }
            , { Name: "ContextKey", Datatype: "NVARCHAR(600)", Nullable: "N", Description: "" }
            , { Name: "Model", Datatype: "VARBINARY", Nullable: "N", Description: "" }
            , { Name: "ProductVersion", Datatype: "NVARCHAR(64)", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_dbo.__MigrationHistory", Type: "Clustered", Columns: ["MigrationId", "ContextKey"] }
        ]
    }
    , {
        TableName: "[dbo].[AspNetRoles]", Description: ""
        , Coumns: [
            { Name: "Id", Datatype: "NVARCHAR(256)", Nullable: "N", Description: "" }
            , { Name: "Name", Datatype: "NVARCHAR(512)", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_dbo.AspNetRoles", Type: "Clustered", Columns: ["Id"] }
            , { Name: "RoleNameIndex", Type: "Nonclustered", Columns: ["Name"] }
        ]
    }
    , {
        TableName: "[dbo].[AspNetUserClaims]", Description: ""
        , Coumns: [
            { Name: "Id", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "UserId", Datatype: "NVARCHAR(256)", Nullable: "N", Description: "" }
            , { Name: "ClaimType", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "ClaimValue", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_dbo.AspNetUserClaims_dbo.AspNetUsers_UserId", Column: "UserId", ReferenceTo: "[AspNetUsers].[Id]" }
        ]
        , Indexes: [
            { Name: "IX_UserId", Type: "Nonclustered", Columns: ["UserId"] }
            , { Name: "PK_dbo.AspNetUserClaims", Type: "Clustered", Columns: ["Id"] }
        ]
    }
    , {
        TableName: "[dbo].[AspNetUserLogins]", Description: ""
        , Coumns: [
            { Name: "LoginProvider", Datatype: "NVARCHAR(256)", Nullable: "N", Description: "" }
            , { Name: "ProviderKey", Datatype: "NVARCHAR(256)", Nullable: "N", Description: "" }
            , { Name: "UserId", Datatype: "NVARCHAR(256)", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_dbo.AspNetUserLogins_dbo.AspNetUsers_UserId", Column: "UserId", ReferenceTo: "[AspNetUsers].[Id]" }
        ]
        , Indexes: [
            { Name: "IX_UserId", Type: "Nonclustered", Columns: ["UserId"] }
            , { Name: "PK_dbo.AspNetUserLogins", Type: "Clustered", Columns: ["LoginProvider", "ProviderKey", "UserId"] }
        ]
    }
    , {
        TableName: "[dbo].[AspNetUserRoles]", Description: ""
        , Coumns: [
            { Name: "UserId", Datatype: "NVARCHAR(256)", Nullable: "N", Description: "" }
            , { Name: "RoleId", Datatype: "NVARCHAR(256)", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_dbo.AspNetUserRoles_dbo.AspNetRoles_RoleId", Column: "RoleId", ReferenceTo: "[AspNetRoles].[Id]" }
            , { Name: "FK_dbo.AspNetUserRoles_dbo.AspNetUsers_UserId", Column: "UserId", ReferenceTo: "[AspNetUsers].[Id]" }
        ]
        , Indexes: [
            { Name: "IX_RoleId", Type: "Nonclustered", Columns: ["RoleId"] }
            , { Name: "IX_UserId", Type: "Nonclustered", Columns: ["UserId"] }
            , { Name: "PK_dbo.AspNetUserRoles", Type: "Clustered", Columns: ["UserId", "RoleId"] }
        ]
    }
    , {
        TableName: "[dbo].[AspNetUsers]", Description: ""
        , Coumns: [
            { Name: "Id", Datatype: "NVARCHAR(256)", Nullable: "N", Description: "" }
            , { Name: "Email", Datatype: "NVARCHAR(512)", Nullable: "Y", Description: "" }
            , { Name: "EmailConfirmed", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "PasswordHash", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "SecurityStamp", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "PhoneNumber", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "PhoneNumberConfirmed", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "TwoFactorEnabled", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "LockoutEndDateUtc", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "LockoutEnabled", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "AccessFailedCount", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "UserName", Datatype: "NVARCHAR(512)", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_dbo.AspNetUsers", Type: "Clustered", Columns: ["Id"] }
            , { Name: "UserNameIndex", Type: "Nonclustered", Columns: ["UserName"] }
        ]
    }
    , {
        TableName: "[dbo].[Especialista]", Description: ""
        , Coumns: [
            { Name: "EspecialistaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(500)", Nullable: "Y", Description: "" }
            , { Name: "ApellidoPaterno", Datatype: "NVARCHAR(500)", Nullable: "Y", Description: "" }
            , { Name: "ApellidoMaterno", Datatype: "NVARCHAR(500)", Nullable: "Y", Description: "" }
            , { Name: "Telefono", Datatype: "NVARCHAR(40)", Nullable: "Y", Description: "" }
            , { Name: "Extension", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "Celular", Datatype: "NVARCHAR(60)", Nullable: "Y", Description: "" }
            , { Name: "Correo", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "Autor", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_dbo.Especialista", Type: "Clustered", Columns: ["EspecialistaId"] }
        ]
    }
    , {
        TableName: "[dbo].[LibroInventariosLibros]", Description: ""
        , Coumns: [
            { Name: "LibroInventarios_NoInventario", Datatype: "NVARCHAR(256)", Nullable: "N", Description: "" }
            , { Name: "Libros_LibrosId", Datatype: "NVARCHAR(256)", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_dbo.LibroInventariosLibros_MT.LibroInventarios_LibroInventarios_NoInventario", Column: "LibroInventarios_NoInventario", ReferenceTo: "[LibroInventarios].[NoInventario]" }
            , { Name: "FK_dbo.LibroInventariosLibros_MT.Libros_Libros_LibrosId", Column: "Libros_LibrosId", ReferenceTo: "[Libros].[LibrosId]" }
        ]
        , Indexes: [
            { Name: "IX_LibroInventarios_NoInventario", Type: "Nonclustered", Columns: ["LibroInventarios_NoInventario"] }
            , { Name: "IX_Libros_LibrosId", Type: "Nonclustered", Columns: ["Libros_LibrosId"] }
            , { Name: "PK_dbo.LibroInventariosLibros", Type: "Clustered", Columns: ["LibroInventarios_NoInventario", "Libros_LibrosId"] }
        ]
    }
    , {
        TableName: "[dbo].[LibrosAutoresLibros]", Description: ""
        , Coumns: [
            { Name: "LibrosAutores_Autor", Datatype: "NVARCHAR(300)", Nullable: "N", Description: "" }
            , { Name: "Libros_LibrosId", Datatype: "NVARCHAR(256)", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_dbo.LibrosAutoresLibros_MT.Libros_Libros_LibrosId", Column: "Libros_LibrosId", ReferenceTo: "[Libros].[LibrosId]" }
            , { Name: "FK_dbo.LibrosAutoresLibros_MT.LibrosAutores_LibrosAutores_Autor", Column: "LibrosAutores_Autor", ReferenceTo: "[LibrosAutores].[Autor]" }
        ]
        , Indexes: [
            { Name: "IX_Libros_LibrosId", Type: "Nonclustered", Columns: ["Libros_LibrosId"] }
            , { Name: "IX_LibrosAutores_Autor", Type: "Nonclustered", Columns: ["LibrosAutores_Autor"] }
            , { Name: "PK_dbo.LibrosAutoresLibros", Type: "Clustered", Columns: ["LibrosAutores_Autor", "Libros_LibrosId"] }
        ]
    }
    , {
        TableName: "[dbo].[LibrosLibroDescriptores]", Description: ""
        , Coumns: [
            { Name: "Libros_LibrosId", Datatype: "NVARCHAR(256)", Nullable: "N", Description: "" }
            , { Name: "LibroDescriptores_Descriptor", Datatype: "NVARCHAR(256)", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_dbo.LibrosLibroDescriptores_MT.LibroDescriptores_LibroDescriptores_Descriptor", Column: "LibroDescriptores_Descriptor", ReferenceTo: "[LibroDescriptores].[Descriptor]" }
            , { Name: "FK_dbo.LibrosLibroDescriptores_MT.Libros_Libros_LibrosId", Column: "Libros_LibrosId", ReferenceTo: "[Libros].[LibrosId]" }
        ]
        , Indexes: [
            { Name: "IX_LibroDescriptores_Descriptor", Type: "Nonclustered", Columns: ["LibroDescriptores_Descriptor"] }
            , { Name: "IX_Libros_LibrosId", Type: "Nonclustered", Columns: ["Libros_LibrosId"] }
            , { Name: "PK_dbo.LibrosLibroDescriptores", Type: "Clustered", Columns: ["Libros_LibrosId", "LibroDescriptores_Descriptor"] }
        ]
    }
    , {
        TableName: "[dbo].[PRUEBA]", Description: ""
        , Coumns: [
            { Name: "ID", Datatype: "NCHAR(20)", Nullable: "Y", Description: "" }
        ]
    }
    , {
        TableName: "[dbo].[PS_IIE_CONTACTOS]", Description: ""
        , Coumns: [
            { Name: "PROJ_ID", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "IIE_NOMBRE_C", Datatype: "CHAR(254)", Nullable: "N", Description: "" }
            , { Name: "IIE_PUESTO", Datatype: "CHAR(100)", Nullable: "N", Description: "" }
            , { Name: "IIE_TELEFONO", Datatype: "CHAR(24)", Nullable: "N", Description: "" }
            , { Name: "IIE_INI_E_MAIL", Datatype: "CHAR(100)", Nullable: "N", Description: "" }
            , { Name: "IIE_DIREC", Datatype: "CHAR(254)", Nullable: "N", Description: "" }
            , { Name: "ClienteTemp", Datatype: "CHAR(254)", Nullable: "Y", Description: "" }
            , { Name: "Validado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "indefinido", Datatype: "BIT", Nullable: "N", Description: "" }
        ]
    }
    , {
        TableName: "[dbo].[sysdiagrams]", Description: ""
        , Coumns: [
            { Name: "name", Datatype: "SYSNAME", Nullable: "N", Description: "" }
            , { Name: "principal_id", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "diagram_id", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "version", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "definition", Datatype: "VARBINARY", Nullable: "Y", Description: "" }
        ]
        , Indexes: [
            { Name: "PK__sysdiagr__C2B05B61C6069299", Type: "Clustered", Columns: ["diagram_id"] }
            , { Name: "UK_principal_name", Type: "Nonclustered", Columns: ["name", "principal_id"] }
        ]
    }
    , {
        TableName: "[dbo].[tCatPersonaON_SIGCO2]", Description: ""
        , Coumns: [
            { Name: "id", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "nombre", Datatype: "VARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "email", Datatype: "VARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "ciudad", Datatype: "VARCHAR(300)", Nullable: "Y", Description: "" }
            , { Name: "tel", Datatype: "VARCHAR(50)", Nullable: "Y", Description: "" }
            , { Name: "ext", Datatype: "VARCHAR(50)", Nullable: "Y", Description: "" }
            , { Name: "cel", Datatype: "VARCHAR(50)", Nullable: "Y", Description: "" }
            , { Name: "fechaRegistro", Datatype: "DATE", Nullable: "Y", Description: "" }
            , { Name: "empleadoRegistro", Datatype: "VARCHAR(5)", Nullable: "Y", Description: "" }
            , { Name: "empresa", Datatype: "VARCHAR(300)", Nullable: "Y", Description: "" }
            , { Name: "cargo", Datatype: "VARCHAR(300)", Nullable: "Y", Description: "" }
            , { Name: "estado", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "validado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "EmpresaId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "ClaveUnidad", Datatype: "NVARCHAR(40)", Nullable: "Y", Description: "" }
        ]
    }
    , {
        TableName: "[GEN].[Adjunto]", Description: ""
        , Coumns: [
            { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "N", Description: "" }
            , { Name: "RutaCompleta", Datatype: "NVARCHAR(-1)", Nullable: "N", Description: "" }
            , { Name: "nombre", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "ModuloId", Datatype: "NVARCHAR(6)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_GEN.Adjunto_GEN.cat_Modulo_ModuloId", Column: "ModuloId", ReferenceTo: "[cat_Modulo].[ModuloId]" }
        ]
        , Indexes: [
            { Name: "IX_ModuloId", Type: "Nonclustered", Columns: ["ModuloId"] }
            , { Name: "PK_GEN.Adjunto", Type: "Clustered", Columns: ["AdjuntoId"] }
        ]
    }
    , {
        TableName: "[GEN].[cat_Aptitudes]", Description: ""
        , Coumns: [
            { Name: "Id", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(-1)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_GEN.cat_Aptitudes", Type: "Clustered", Columns: ["Id"] }
        ]
    }
    , {
        TableName: "[GEN].[cat_Categoria]", Description: ""
        , Coumns: [
            { Name: "CategoriaId", Datatype: "NVARCHAR(256)", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NivelInvestigador", Datatype: "NVARCHAR(10)", Nullable: "Y", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_GEN.cat_Categorias", Type: "Clustered", Columns: ["CategoriaId"] }
        ]
    }
    , {
        TableName: "[GEN].[cat_EstadoFlujo]", Description: ""
        , Coumns: [
            { Name: "EstadoFlujoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "DescripcionCorta", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_GEN.cat_EstadoFlujo", Type: "Clustered", Columns: ["EstadoFlujoId"] }
        ]
    }
    , {
        TableName: "[GEN].[cat_Estados]", Description: ""
        , Coumns: [
            { Name: "EstadoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NombreEstado", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "PaisId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_GEN.cat_Estados_GEN.cat_Paises_PaisId", Column: "PaisId", ReferenceTo: "[cat_Paises].[PaisId]" }
        ]
        , Indexes: [
            { Name: "IX_PaisId", Type: "Nonclustered", Columns: ["PaisId"] }
            , { Name: "PK_GEN.cat_Estados", Type: "Clustered", Columns: ["EstadoId"] }
        ]
    }
    , {
        TableName: "[GEN].[cat_Funciones]", Description: ""
        , Coumns: [
            { Name: "FuncionesId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(510)", Nullable: "Y", Description: "" }
            , { Name: "Url", Datatype: "NVARCHAR(510)", Nullable: "Y", Description: "" }
            , { Name: "Nivel", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Secuencia", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "IdPadre", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "IdModulo", Datatype: "NVARCHAR(6)", Nullable: "N", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "ClaseIcono", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "State", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_GEN.cat_Funciones_GEN.cat_Funciones_IdPadre", Column: "IdPadre", ReferenceTo: "[cat_Funciones].[FuncionesId]" }
            , { Name: "FK_GEN.cat_Funciones_GEN.cat_Modulo_IdModulo", Column: "IdModulo", ReferenceTo: "[cat_Modulo].[ModuloId]" }
        ]
        , Indexes: [
            { Name: "IX_IdModulo", Type: "Nonclustered", Columns: ["IdModulo"] }
            , { Name: "IX_IdPadre", Type: "Nonclustered", Columns: ["IdPadre"] }
            , { Name: "PK_GEN.cat_Funciones", Type: "Clustered", Columns: ["FuncionesId"] }
        ]
    }
    , {
        TableName: "[GEN].[cat_FuncionesRol]", Description: ""
        , Coumns: [
            { Name: "FuncionesRolId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "IdRol", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "IdFuncion", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_GEN.cat_FuncionesRol_GEN.cat_Funciones_IdFuncion", Column: "IdFuncion", ReferenceTo: "[cat_Funciones].[FuncionesId]" }
            , { Name: "FK_GEN.cat_FuncionesRol_GEN.cat_Roles_IdRol", Column: "IdRol", ReferenceTo: "[cat_Roles].[RolId]" }
        ]
        , Indexes: [
            { Name: "IX_IdFuncion", Type: "Nonclustered", Columns: ["IdFuncion"] }
            , { Name: "IX_IdRol", Type: "Nonclustered", Columns: ["IdRol"] }
            , { Name: "PK_GEN.cat_FuncionesRol", Type: "Clustered", Columns: ["FuncionesRolId"] }
        ]
    }
    , {
        TableName: "[GEN].[cat_Likes]", Description: ""
        , Coumns: [
            { Name: "Id", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(-1)", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_GEN.cat_Likes", Type: "Clustered", Columns: ["Id"] }
        ]
    }
    , {
        TableName: "[GEN].[cat_Modulo]", Description: ""
        , Coumns: [
            { Name: "ModuloId", Datatype: "NVARCHAR(6)", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaEfectiva", Datatype: "DATETIME", Nullable: "N", Description: "" }
        ]
        , DefaultConstraints: [
            { Name: "DF__cat_Modul__Estad__4CC05EF3", Column: "Estado", Value: "((0))" }
            , { Name: "DF__cat_Modul__Fecha__4DB4832C", Column: "FechaEfectiva", Value: "('1900-01-01T00:00:00.000')" }
        ]
        , Indexes: [
            { Name: "PK_GEN.cat_Modulo", Type: "Clustered", Columns: ["ModuloId"] }
        ]
    }
    , {
        TableName: "[GEN].[cat_Municipios]", Description: ""
        , Coumns: [
            { Name: "MunicipioId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NombreMunicipio", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "EstadoId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_GEN.cat_Municipios_GEN.cat_Estados_EstadoId", Column: "EstadoId", ReferenceTo: "[cat_Estados].[EstadoId]" }
        ]
        , Indexes: [
            { Name: "IX_EstadoId", Type: "Nonclustered", Columns: ["EstadoId"] }
            , { Name: "PK_GEN.cat_Municipios", Type: "Clustered", Columns: ["MunicipioId"] }
        ]
    }
    , {
        TableName: "[GEN].[cat_OCcRolesBlackList]", Description: ""
        , Coumns: [
            { Name: "RolId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "OcsId", Datatype: "NVARCHAR(200)", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_GEN.cat_OCcRolesBlackList_GEN.cat_Ocs_OcsId", Column: "OcsId", ReferenceTo: "[cat_Ocs].[OcsId]" }
            , { Name: "FK_GEN.cat_OCcRolesBlackList_GEN.cat_Roles_RolId", Column: "RolId", ReferenceTo: "[cat_Roles].[RolId]" }
        ]
        , Indexes: [
            { Name: "IX_OcsId", Type: "Nonclustered", Columns: ["OcsId"] }
            , { Name: "IX_RolId", Type: "Nonclustered", Columns: ["RolId"] }
            , { Name: "PK_GEN.cat_OCcRolesBlackList", Type: "Clustered", Columns: ["RolId", "OcsId"] }
        ]
    }
    , {
        TableName: "[GEN].[cat_Ocs]", Description: ""
        , Coumns: [
            { Name: "OcsId", Datatype: "NVARCHAR(200)", Nullable: "N", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "ModuloOrigenId", Datatype: "NVARCHAR(6)", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_GEN.cat_Ocs_GEN.cat_Modulo_ModuloOrigenId", Column: "ModuloOrigenId", ReferenceTo: "[cat_Modulo].[ModuloId]" }
        ]
        , Indexes: [
            { Name: "IX_ModuloOrigenId", Type: "Nonclustered", Columns: ["ModuloOrigenId"] }
            , { Name: "PK_GEN.cat_Ocs", Type: "Clustered", Columns: ["OcsId"] }
        ]
    }
    , {
        TableName: "[GEN].[cat_Paises]", Description: ""
        , Coumns: [
            { Name: "PaisId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NombrePais", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_GEN.cat_Paises", Type: "Clustered", Columns: ["PaisId"] }
        ]
    }
    , {
        TableName: "[GEN].[cat_Personas]", Description: ""
        , Coumns: [
            { Name: "ClavePersona", Datatype: "NVARCHAR(20)", Nullable: "N", Description: "" }
            , { Name: "RUPersona", Datatype: "NVARCHAR(40)", Nullable: "N", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "ApellidoMaterno", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "Correo", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "ExperienciaPrevia", Datatype: "REAL", Nullable: "N", Description: "" }
            , { Name: "CategoriaId", Datatype: "NVARCHAR(256)", Nullable: "Y", Description: "" }
            , { Name: "TipoPersonalId", Datatype: "NVARCHAR(256)", Nullable: "Y", Description: "" }
            , { Name: "ClaveUnidad", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaEfectiva", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "PlazaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ApellidoPaterno", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "TipoContratoId", Datatype: "NVARCHAR(10)", Nullable: "Y", Description: "" }
            , { Name: "OrigenDatos", Datatype: "NVARCHAR(40)", Nullable: "Y", Description: "" }
            , { Name: "plazaTrabajo", Datatype: "NVARCHAR(40)", Nullable: "Y", Description: "" }
            , { Name: "FechaIngreso", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "FechaNacimiento", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "sexo", Datatype: "NVARCHAR(10)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_GEN.cat_Personas_GEN.cat_Categorias_CveCategoria", Column: "CategoriaId", ReferenceTo: "[cat_Categoria].[CategoriaId]" }
            , { Name: "FK_GEN.cat_Personas_GEN.cat_PlazaTrabajo_IdPlaza", Column: "PlazaId", ReferenceTo: "[cat_PlazaTrabajo].[PlazaId]" }
            , { Name: "FK_GEN.cat_Personas_GEN.cat_TipoContrato_TipoContratoId", Column: "TipoContratoId", ReferenceTo: "[cat_TipoContrato].[ContratoId]" }
            , { Name: "FK_GEN.cat_Personas_GEN.cat_TipoPersona_TipoPersona", Column: "TipoPersonalId", ReferenceTo: "[cat_TipoPersona].[TipoPersonaId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__cat_Perso__Fecha__224B023A", Column: "FechaIngreso", Value: "('1900-01-01T00:00:00.000')" }
            , { Name: "DF__cat_Perso__Fecha__233F2673", Column: "FechaNacimiento", Value: "('1900-01-01T00:00:00.000')" }
            , { Name: "DF__cat_Perso__IdPla__36670980", Column: "PlazaId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_CategoriaId", Type: "Nonclustered", Columns: ["CategoriaId"] }
            , { Name: "IX_PlazaId", Type: "Nonclustered", Columns: ["PlazaId"] }
            , { Name: "IX_TipoContratoId", Type: "Nonclustered", Columns: ["TipoContratoId"] }
            , { Name: "IX_TipoPersonalId", Type: "Nonclustered", Columns: ["TipoPersonalId"] }
            , { Name: "PK_GEN.cat_Personas", Type: "Clustered", Columns: ["ClavePersona", "RUPersona", "FechaEfectiva"] }
        ]
    }
    , {
        TableName: "[GEN].[cat_PlazaTrabajo]", Description: ""
        , Coumns: [
            { Name: "PlazaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_GEN.cat_PlazaTrabajo", Type: "Clustered", Columns: ["PlazaId"] }
        ]
    }
    , {
        TableName: "[GEN].[cat_Roles]", Description: ""
        , Coumns: [
            { Name: "RolId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_GEN.cat_Roles", Type: "Clustered", Columns: ["RolId"] }
        ]
    }
    , {
        TableName: "[GEN].[cat_RolPersona]", Description: ""
        , Coumns: [
            { Name: "RolPersonaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "IdRol", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_GEN.cat_RolPersona_GEN.cat_Roles_IdRol", Column: "IdRol", ReferenceTo: "[cat_Roles].[RolId]" }
        ]
        , Indexes: [
            { Name: "IX_IdRol", Type: "Nonclustered", Columns: ["IdRol"] }
            , { Name: "PK_GEN.cat_RolPersona", Type: "Clustered", Columns: ["RolPersonaId"] }
        ]
    }
    , {
        TableName: "[GEN].[cat_TipoContrato]", Description: ""
        , Coumns: [
            { Name: "ContratoId", Datatype: "NVARCHAR(10)", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_GEN.cat_TipoContrato", Type: "Clustered", Columns: ["ContratoId"] }
        ]
    }
    , {
        TableName: "[GEN].[cat_TipoPersona]", Description: ""
        , Coumns: [
            { Name: "TipoPersonaId", Datatype: "NVARCHAR(256)", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaEfectiva", Datatype: "DATETIME", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_GEN.cat_TipoPersona", Type: "Clustered", Columns: ["TipoPersonaId"] }
        ]
    }
    , {
        TableName: "[GEN].[cat_TipoUnidad]", Description: ""
        , Coumns: [
            { Name: "TipoUnidadID", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaEfectiva", Datatype: "DATETIME", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_GEN.cat_TipoUnidad", Type: "Clustered", Columns: ["TipoUnidadID"] }
        ]
    }
    , {
        TableName: "[GEN].[cat_UbicacionAreas]", Description: ""
        , Coumns: [
            { Name: "UbicacionAreaID", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NoEdificio", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "NoPiso", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_GEN.cat_UbicacionAreas", Type: "Clustered", Columns: ["UbicacionAreaID"] }
        ]
    }
    , {
        TableName: "[GEN].[cat_UnidadOrganizacional]", Description: ""
        , Coumns: [
            { Name: "ClaveUnidad", Datatype: "NVARCHAR(20)", Nullable: "N", Description: "" }
            , { Name: "NombreUnidad", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaEfectiva", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "padre", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "ClaveResponsable", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "tipoO", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Localizacion", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_GEN.cat_UnidadOrganizacional_GEN.cat_TipoUnidad_tipoO", Column: "tipoO", ReferenceTo: "[cat_TipoUnidad].[TipoUnidadID]" }
        ]
        , Indexes: [
            { Name: "IX_tipoO", Type: "Nonclustered", Columns: ["tipoO"] }
            , { Name: "PK_GEN.cat_UnidadOrganizacional", Type: "Clustered", Columns: ["ClaveUnidad", "FechaEfectiva"] }
        ]
    }
    , {
        TableName: "[GEN].[Catalogo]", Description: ""
        , Coumns: [
            { Name: "CatalogoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClaveIdCatalogo", Datatype: "NVARCHAR(160)", Nullable: "N", Description: "" }
            , { Name: "nombre", Datatype: "NVARCHAR(-1)", Nullable: "N", Description: "" }
            , { Name: "descripcion", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "estatus", Datatype: "NVARCHAR(-1)", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "IX_ClaveIdCatalogo", Type: "Nonclustered", Columns: ["ClaveIdCatalogo"] }
            , { Name: "PK_GEN.Catalogo", Type: "Clustered", Columns: ["CatalogoId"] }
        ]
    }
    , {
        TableName: "[GEN].[Configuracion]", Description: ""
        , Coumns: [
            { Name: "id", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "variable", Datatype: "NVARCHAR(160)", Nullable: "N", Description: "" }
            , { Name: "nombre", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "valor", Datatype: "NVARCHAR(-1)", Nullable: "N", Description: "" }
            , { Name: "estatus", Datatype: "NVARCHAR(-1)", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "IX_variable", Type: "Nonclustered", Columns: ["variable"] }
            , { Name: "PK_GEN.Configuracion", Type: "Clustered", Columns: ["id"] }
        ]
    }
    , {
        TableName: "[GEN].[Iniciativas]", Description: ""
        , Coumns: [
            { Name: "FolioId", Datatype: "NVARCHAR(20)", Nullable: "N", Description: "" }
            , { Name: "Titulo", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "ClaveEmpIniciativa", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "Fecha", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "UnidadOrganizacionalId", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "SubPrograma", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "Origen", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "EstadoIniciativa", Datatype: "NVARCHAR(40)", Nullable: "Y", Description: "" }
            , { Name: "Costos", Datatype: "DECIMAL(18,2)", Nullable: "Y", Description: "" }
            , { Name: "EmpresaId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "ClaveUnidadEmpresa", Datatype: "NVARCHAR(40)", Nullable: "Y", Description: "" }
            , { Name: "ContactoId", Datatype: "INT", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_GEN.Iniciativas_CR.cat_Contactos_ContactoId", Column: "ContactoId", ReferenceTo: "[cat_Contactos].[ContactoId]" }
            , { Name: "FK_GEN.Iniciativas_CR.cat_Empresas_EmpresaId", Column: "EmpresaId", ReferenceTo: "[cat_Empresas].[EmpresaId]" }
            , { Name: "FK_GEN.Iniciativas_CR.UnidadOrganizacionalEmpresas_ClaveUnidadEmpresa", Column: "ClaveUnidadEmpresa", ReferenceTo: "[UnidadOrganizacionalEmpresas].[ClaveUnidad]" }
        ]
        , Indexes: [
            { Name: "IX_ClaveUnidadEmpresa", Type: "Nonclustered", Columns: ["ClaveUnidadEmpresa"] }
            , { Name: "IX_ContactoId", Type: "Nonclustered", Columns: ["ContactoId"] }
            , { Name: "IX_EmpresaId", Type: "Nonclustered", Columns: ["EmpresaId"] }
            , { Name: "PK_dbo.Iniciativas", Type: "Clustered", Columns: ["FolioId"] }
        ]
    }
    , {
        TableName: "[GEN].[NuevoOC]", Description: ""
        , Coumns: [
            { Name: "NuevoOCId", Datatype: "BIGINT", Nullable: "N", Description: "" }
            , { Name: "descripcion", Datatype: "NVARCHAR(-1)", Nullable: "N", Description: "" }
            , { Name: "ModuloId", Datatype: "NVARCHAR(6)", Nullable: "N", Description: "" }
            , { Name: "OcsId", Datatype: "NVARCHAR(200)", Nullable: "N", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "nuevo", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "liga", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "IdExterno", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_GEN.NuevoOC_GEN.cat_Modulo_ModuloId", Column: "ModuloId", ReferenceTo: "[cat_Modulo].[ModuloId]" }
            , { Name: "FK_GEN.NuevoOC_GEN.cat_Ocs_OcsId", Column: "OcsId", ReferenceTo: "[cat_Ocs].[OcsId]" }
        ]
        , Indexes: [
            { Name: "IX_ModuloId", Type: "Nonclustered", Columns: ["ModuloId"] }
            , { Name: "IX_OcsId", Type: "Nonclustered", Columns: ["OcsId"] }
            , { Name: "PK_GEN.NuevoOC", Type: "Clustered", Columns: ["NuevoOCId"] }
        ]
    }
    , {
        TableName: "[GEN].[OCSuscripciones]", Description: ""
        , Coumns: [
            { Name: "ClaveEmpleado", Datatype: "NVARCHAR(20)", Nullable: "N", Description: "" }
            , { Name: "OcsId", Datatype: "NVARCHAR(200)", Nullable: "N", Description: "" }
            , { Name: "suscrito", Datatype: "BIT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_GEN.OCSuscripciones_GEN.cat_Ocs_OcsId", Column: "OcsId", ReferenceTo: "[cat_Ocs].[OcsId]" }
        ]
        , Indexes: [
            { Name: "IX_OcsId", Type: "Nonclustered", Columns: ["OcsId"] }
            , { Name: "PK_GEN.OCSuscripciones", Type: "Clustered", Columns: ["ClaveEmpleado", "OcsId"] }
        ]
    }
    , {
        TableName: "[GEN].[Opcion]", Description: ""
        , Coumns: [
            { Name: "id", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "catalogoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "etiqueta", Datatype: "NVARCHAR(-1)", Nullable: "N", Description: "" }
            , { Name: "valor", Datatype: "NVARCHAR(-1)", Nullable: "N", Description: "" }
            , { Name: "orden", Datatype: "INT", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_GEN.Opcion_GEN.Catalogo_catalogoId", Column: "catalogoId", ReferenceTo: "[Catalogo].[CatalogoId]" }
        ]
        , Indexes: [
            { Name: "IX_catalogoId", Type: "Nonclustered", Columns: ["catalogoId"] }
            , { Name: "PK_GEN.Opcion", Type: "Clustered", Columns: ["id"] }
        ]
    }
    , {
        TableName: "[GEN].[PersonalProyecto]", Description: ""
        , Coumns: [
            { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "N", Description: "" }
            , { Name: "PersonalProyectoId", Datatype: "BIGINT", Nullable: "N", Description: "" }
            , { Name: "ProyectoId", Datatype: "NVARCHAR(20)", Nullable: "N", Description: "" }
            , { Name: "FechaInicio", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "FechaTermino", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "Participacion", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "DescripcionActividades", Datatype: "NVARCHAR(1000)", Nullable: "Y", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "Y", Description: "" }
            , { Name: "FechaValidacion", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "EstadoFlujoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Origen", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_GEN.PersonalProyecto_GEN.Adjunto_AdjuntoId", Column: "AdjuntoId", ReferenceTo: "[Adjunto].[AdjuntoId]" }
            , { Name: "FK_GEN.PersonalProyecto_GEN.cat_EstadoFlujo_EstadoFlujoId", Column: "EstadoFlujoId", ReferenceTo: "[cat_EstadoFlujo].[EstadoFlujoId]" }
            , { Name: "FK_GEN.PersonalProyecto_GEN.Proyectos_ProyectoId", Column: "ProyectoId", ReferenceTo: "[Proyectos].[ProyectoId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__PersonalP__Fecha__0F6D37F0", Column: "FechaInicio", Value: "('1900-01-01T00:00:00.000')" }
            , { Name: "DF__PersonalP__Fecha__10615C29", Column: "FechaTermino", Value: "('1900-01-01T00:00:00.000')" }
        ]
        , Indexes: [
            { Name: "IX_AdjuntoId", Type: "Nonclustered", Columns: ["AdjuntoId"] }
            , { Name: "IX_EstadoFlujoId", Type: "Nonclustered", Columns: ["EstadoFlujoId"] }
            , { Name: "IX_ProyectoId", Type: "Nonclustered", Columns: ["ProyectoId"] }
            , { Name: "PK_GEN.PersonalProyecto", Type: "Clustered", Columns: ["PersonalProyectoId"] }
        ]
    }
    , {
        TableName: "[GEN].[Propuestas]", Description: ""
        , Coumns: [
            { Name: "PropuestaId", Datatype: "NVARCHAR(50)", Nullable: "N", Description: "" }
            , { Name: "Titulo", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "ClaveEmpPropuesta", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "Fecha", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "UnidadOrganizacionalId", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "SubPrograma", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "Origen", Datatype: "NVARCHAR(80)", Nullable: "Y", Description: "" }
            , { Name: "EstadoPropuesta", Datatype: "NVARCHAR(80)", Nullable: "Y", Description: "" }
            , { Name: "Costos", Datatype: "DECIMAL(18,2)", Nullable: "Y", Description: "" }
            , { Name: "EmpresaId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "ClaveUnidadEmpresa", Datatype: "NVARCHAR(40)", Nullable: "Y", Description: "" }
            , { Name: "ContactoId", Datatype: "INT", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_GEN.Propuestas_CR.cat_Contactos_ContactoId", Column: "ContactoId", ReferenceTo: "[cat_Contactos].[ContactoId]" }
            , { Name: "FK_GEN.Propuestas_CR.cat_Empresas_EmpresaId", Column: "EmpresaId", ReferenceTo: "[cat_Empresas].[EmpresaId]" }
            , { Name: "FK_GEN.Propuestas_CR.UnidadOrganizacionalEmpresas_ClaveUnidadEmpresa", Column: "ClaveUnidadEmpresa", ReferenceTo: "[UnidadOrganizacionalEmpresas].[ClaveUnidad]" }
        ]
        , Indexes: [
            { Name: "IX_ClaveUnidadEmpresa", Type: "Nonclustered", Columns: ["ClaveUnidadEmpresa"] }
            , { Name: "IX_ContactoId", Type: "Nonclustered", Columns: ["ContactoId"] }
            , { Name: "IX_EmpresaId", Type: "Nonclustered", Columns: ["EmpresaId"] }
            , { Name: "PK_dbo.Propuestas", Type: "Clustered", Columns: ["PropuestaId"] }
        ]
    }
    , {
        TableName: "[GEN].[Proyectos]", Description: ""
        , Coumns: [
            { Name: "ProyectoId", Datatype: "NVARCHAR(20)", Nullable: "N", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "NumjefeProyecto", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "NombreJefeProyecto", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "FechaInicio", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "FechaFin", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "UnidadOrganizacionalId", Datatype: "NVARCHAR(20)", Nullable: "N", Description: "" }
            , { Name: "SubPrograma", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "Origen", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "EstadoProyecto", Datatype: "NVARCHAR(40)", Nullable: "Y", Description: "" }
            , { Name: "Costo", Datatype: "REAL", Nullable: "Y", Description: "" }
            , { Name: "EmpresaId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "ClaveUnidadEmpresa", Datatype: "NVARCHAR(40)", Nullable: "Y", Description: "" }
            , { Name: "ContactoId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "FacturacionPlaneada", Datatype: "DECIMAL(18,2)", Nullable: "Y", Description: "" }
            , { Name: "FacturacionReal", Datatype: "DECIMAL(18,2)", Nullable: "Y", Description: "" }
            , { Name: "TipoProyecto", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_GEN.Proyectos_CR.cat_Contactos_ContactoId", Column: "ContactoId", ReferenceTo: "[cat_Contactos].[ContactoId]" }
            , { Name: "FK_GEN.Proyectos_CR.cat_Empresas_EmpresaId", Column: "EmpresaId", ReferenceTo: "[cat_Empresas].[EmpresaId]" }
            , { Name: "FK_GEN.Proyectos_CR.UnidadOrganizacionalEmpresas_ClaveUnidadEmpresa", Column: "ClaveUnidadEmpresa", ReferenceTo: "[UnidadOrganizacionalEmpresas].[ClaveUnidad]" }
        ]
        , Indexes: [
            { Name: "IX_ClaveUnidadEmpresa", Type: "Nonclustered", Columns: ["ClaveUnidadEmpresa"] }
            , { Name: "IX_ContactoId", Type: "Nonclustered", Columns: ["ContactoId"] }
            , { Name: "IX_EmpresaId", Type: "Nonclustered", Columns: ["EmpresaId"] }
            , { Name: "PK_GEN.Proyectos", Type: "Clustered", Columns: ["ProyectoId"] }
        ]
    }
    , {
        TableName: "[GEN].[RecuperaPassword]", Description: ""
        , Coumns: [
            { Name: "RecuperaPasswordId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "ValidezenMinnnutos", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Activo", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_GEN.RecuperaPassword", Type: "Clustered", Columns: ["RecuperaPasswordId"] }
        ]
    }
    , {
        TableName: "[GEN].[tab_AccesoSistema]", Description: ""
        , Coumns: [
            { Name: "AccesoID", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "UserName", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "PasswordSha", Datatype: "VARBINARY", Nullable: "Y", Description: "" }
            , { Name: "OrigenDatos", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_GEN.tab_AccesoSistema", Type: "Clustered", Columns: ["AccesoID"] }
        ]
    }
    , {
        TableName: "[GEN].[tab_AptitudesEmpleado]", Description: ""
        , Coumns: [
            { Name: "Id", Datatype: "BIGINT", Nullable: "N", Description: "" }
            , { Name: "AptitudesCatId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClaveEmpleado", Datatype: "NVARCHAR(-1)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_GEN.tab_AptitudesEmpleado_GEN.cat_Aptitudes_AptitudesCatId", Column: "AptitudesCatId", ReferenceTo: "[cat_Aptitudes].[Id]" }
        ]
        , Indexes: [
            { Name: "IX_AptitudesCatId", Type: "Nonclustered", Columns: ["AptitudesCatId"] }
            , { Name: "PK_GEN.tab_AptitudesEmpleado", Type: "Clustered", Columns: ["Id"] }
        ]
    }
    , {
        TableName: "[GEN].[tab_BitacoraSolicitudes]", Description: ""
        , Coumns: [
            { Name: "BitacoraSolicitudesId", Datatype: "BIGINT", Nullable: "N", Description: "" }
            , { Name: "SolicitudId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaMovimiento", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "EstadoFlujoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "idRol", Datatype: "INT", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_GEN.tab_BitacoraSolicitudes_GEN.cat_EstadoFlujo_EstadoFlujoId", Column: "EstadoFlujoId", ReferenceTo: "[cat_EstadoFlujo].[EstadoFlujoId]" }
        ]
        , Indexes: [
            { Name: "IX_EstadoFlujoId", Type: "Nonclustered", Columns: ["EstadoFlujoId"] }
            , { Name: "PK_GEN.tab_BitacoraSolicitudes", Type: "Clustered", Columns: ["BitacoraSolicitudesId"] }
        ]
    }
    , {
        TableName: "[GEN].[tab_BitacoraSolicitudesAcceso]", Description: ""
        , Coumns: [
            { Name: "BitacoraSolicitudesAccesoId", Datatype: "BIGINT", Nullable: "N", Description: "" }
            , { Name: "SolicitudAccesoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaMovimiento", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "EstadoFlujoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "RolAutorizador", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "UnidadOrganizacionalId", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_GEN.tab_BitacoraSolicitudesAcceso_GEN.cat_EstadoFlujo_EstadoFlujoId", Column: "EstadoFlujoId", ReferenceTo: "[cat_EstadoFlujo].[EstadoFlujoId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_Bitac__RolAu__5BD88551", Column: "RolAutorizador", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_EstadoFlujoId", Type: "Nonclustered", Columns: ["EstadoFlujoId"] }
            , { Name: "PK_GEN.tab_BitacoraSolicitudesAcceso", Type: "Clustered", Columns: ["BitacoraSolicitudesAccesoId"] }
        ]
    }
    , {
        TableName: "[GEN].[tab_DetallePersona]", Description: ""
        , Coumns: [
            { Name: "ClaveEmpleado", Datatype: "NVARCHAR(256)", Nullable: "N", Description: "" }
            , { Name: "Calle", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Colonia", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Ciudad", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "EstadoCivil", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Celular", Datatype: "NVARCHAR(40)", Nullable: "Y", Description: "" }
            , { Name: "Extension", Datatype: "NVARCHAR(10)", Nullable: "Y", Description: "" }
            , { Name: "OrigenDatos", Datatype: "NVARCHAR(40)", Nullable: "Y", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "Y", Description: "" }
            , { Name: "Ubicacion", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_GEN.tab_DetallePersona_GEN.Adjunto_AdjuntoId", Column: "AdjuntoId", ReferenceTo: "[Adjunto].[AdjuntoId]" }
        ]
        , Indexes: [
            { Name: "IX_AdjuntoId", Type: "Nonclustered", Columns: ["AdjuntoId"] }
            , { Name: "PK_GEN.tab_DetallePersona", Type: "Clustered", Columns: ["ClaveEmpleado"] }
        ]
    }
    , {
        TableName: "[GEN].[tab_EdadPromedioHistorico]", Description: ""
        , Coumns: [
            { Name: "year", Datatype: "NVARCHAR(256)", Nullable: "N", Description: "" }
            , { Name: "edadpromedio", Datatype: "DECIMAL(18,2)", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_GEN.tab_EdadPromedioHistorico", Type: "Clustered", Columns: ["year"] }
        ]
    }
    , {
        TableName: "[GEN].[tab_LikesLinked]", Description: ""
        , Coumns: [
            { Name: "Id", Datatype: "BIGINT", Nullable: "N", Description: "" }
            , { Name: "Aprobador", Datatype: "NVARCHAR(-1)", Nullable: "N", Description: "" }
            , { Name: "Empleado", Datatype: "NVARCHAR(-1)", Nullable: "N", Description: "" }
            , { Name: "Tipo", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "IdExteno", Datatype: "NVARCHAR(-1)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_GEN.tab_LikesLinked_GEN.cat_Likes_Tipo", Column: "Tipo", ReferenceTo: "[cat_Likes].[Id]" }
        ]
        , Indexes: [
            { Name: "IX_Tipo", Type: "Nonclustered", Columns: ["Tipo"] }
            , { Name: "PK_GEN.tab_LikesLinked", Type: "Clustered", Columns: ["Id"] }
        ]
    }
    , {
        TableName: "[GEN].[tab_Log]", Description: ""
        , Coumns: [
            { Name: "LogId", Datatype: "BIGINT", Nullable: "N", Description: "" }
            , { Name: "Date", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Thread", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Level", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Logger", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Message", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Exception", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_GEN.tab_Log", Type: "Clustered", Columns: ["LogId"] }
        ]
    }
    , {
        TableName: "[GEN].[tab_LogBitacora]", Description: ""
        , Coumns: [
            { Name: "Id", Datatype: "BIGINT", Nullable: "N", Description: "" }
            , { Name: "Date", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Thread", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Level", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Logger", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Action", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Data", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "User", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Ip", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_GEN.tab_LogBitacora", Type: "Clustered", Columns: ["Id"] }
        ]
    }
    , {
        TableName: "[GEN].[tab_MovimientoCategoria]", Description: ""
        , Coumns: [
            { Name: "Id", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Fecha", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "CategoriaReal", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "CategoriaAsignada", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_dbo.tab_MovimientoCategoria", Type: "Clustered", Columns: ["Id"] }
        ]
    }
    , {
        TableName: "[GEN].[tab_MovimientoPuesto]", Description: ""
        , Coumns: [
            { Name: "Id", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Fecha", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Puesto", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_dbo.tab_MovimientoPuesto", Type: "Clustered", Columns: ["Id"] }
        ]
    }
    , {
        TableName: "[GEN].[tab_MovimientoUnidadOrg]", Description: ""
        , Coumns: [
            { Name: "Id", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Fecha", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "ClaveUnidad", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_dbo.tab_MovimientoUnidadOrg", Type: "Clustered", Columns: ["Id"] }
        ]
    }
    , {
        TableName: "[GEN].[tab_SolicitudAcceso]", Description: ""
        , Coumns: [
            { Name: "SolicitudAccesoId", Datatype: "BIGINT", Nullable: "N", Description: "" }
            , { Name: "ClavePersonaSolicitante", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "TipoInformacionId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "InformacionOCId", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "FechaSolicitud", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "unidadAutorizadoraId", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "EstadoFlujoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ModuloId", Datatype: "NVARCHAR(6)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_GEN.tab_SolicitudAcceso_CH.cat_TipoInformacion_TipoInformacionId", Column: "TipoInformacionId", ReferenceTo: "[cat_TipoInformacion].[TipoInformacionId]" }
            , { Name: "FK_GEN.tab_SolicitudAcceso_GEN.cat_EstadoFlujo_EstadoFlujoId", Column: "EstadoFlujoId", ReferenceTo: "[cat_EstadoFlujo].[EstadoFlujoId]" }
            , { Name: "FK_GEN.tab_SolicitudAcceso_GEN.cat_Modulo_ModuloId", Column: "ModuloId", ReferenceTo: "[cat_Modulo].[ModuloId]" }
        ]
        , Indexes: [
            { Name: "IX_EstadoFlujoId", Type: "Nonclustered", Columns: ["EstadoFlujoId"] }
            , { Name: "IX_ModuloId", Type: "Nonclustered", Columns: ["ModuloId"] }
            , { Name: "IX_TipoInformacionId", Type: "Nonclustered", Columns: ["TipoInformacionId"] }
            , { Name: "PK_GEN.tab_SolicitudAcceso", Type: "Clustered", Columns: ["SolicitudAccesoId"] }
        ]
    }
    , {
        TableName: "[GEN].[Vocabulario]", Description: ""
        , Coumns: [
            { Name: "VocabularioId", Datatype: "NVARCHAR(30)", Nullable: "N", Description: "" }
            , { Name: "Disponible", Datatype: "BIT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_dbo.Vocabulario", Type: "Clustered", Columns: ["VocabularioId"] }
        ]
    }
    , {
        TableName: "[GEN].[VocabularioDocumento]", Description: ""
        , Coumns: [
            { Name: "VocabularioId", Datatype: "NVARCHAR(30)", Nullable: "N", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "N", Description: "" }
            , { Name: "Disponible", Datatype: "BIT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_GEN.VocabularioDocumento", Type: "Clustered", Columns: ["VocabularioId", "AdjuntoId"] }
        ]
    }
    , {
        TableName: "[MT].[AdjuntoCapitulos]", Description: ""
        , Coumns: [
            { Name: "AdjuntoCapituloId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "Y", Description: "" }
            , { Name: "CapitulosId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_MT.AdjuntoCapitulos_GEN.Adjunto_AdjuntoId", Column: "AdjuntoId", ReferenceTo: "[Adjunto].[AdjuntoId]" }
            , { Name: "FK_MT.AdjuntoCapitulos_MT.Capitulos_CapitulosId", Column: "CapitulosId", ReferenceTo: "[Capitulos].[CapitulosId]" }
        ]
        , Indexes: [
            { Name: "IX_AdjuntoId", Type: "Nonclustered", Columns: ["AdjuntoId"] }
            , { Name: "IX_CapitulosId", Type: "Nonclustered", Columns: ["CapitulosId"] }
            , { Name: "PK_MT.AdjuntoCapitulos", Type: "Clustered", Columns: ["AdjuntoCapituloId"] }
        ]
    }
    , {
        TableName: "[MT].[AdjuntoCursosPersonal]", Description: ""
        , Coumns: [
            { Name: "AdjuntoCursosPersonalId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "N", Description: "" }
            , { Name: "CursosPersonalId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_MT.AdjuntoCursosPersonal_GEN.Adjunto_AdjuntoId", Column: "AdjuntoId", ReferenceTo: "[Adjunto].[AdjuntoId]" }
            , { Name: "FK_MT.AdjuntoCursosPersonal_MT.CursosPersonal_CursosPersonalId", Column: "CursosPersonalId", ReferenceTo: "[CursosPersonal].[CursosPersonalId]" }
        ]
        , Indexes: [
            { Name: "IX_AdjuntoId", Type: "Nonclustered", Columns: ["AdjuntoId"] }
            , { Name: "IX_CursosPersonalId", Type: "Nonclustered", Columns: ["CursosPersonalId"] }
            , { Name: "PK_MT.AdjuntoCursosPersonal", Type: "Clustered", Columns: ["AdjuntoCursosPersonalId"] }
        ]
    }
    , {
        TableName: "[MT].[AdjuntoITF]", Description: ""
        , Coumns: [
            { Name: "AdjuntoITFId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "N", Description: "" }
            , { Name: "ITFgeneralId", Datatype: "NVARCHAR(50)", Nullable: "Y", Description: "" }
            , { Name: "Procesado", Datatype: "BIT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_MT.AdjuntoITF_GEN.Adjunto_AdjuntoId", Column: "AdjuntoId", ReferenceTo: "[Adjunto].[AdjuntoId]" }
            , { Name: "FK_MT.AdjuntoITF_MT.InformeTFgeneral_ITFgeneralId", Column: "ITFgeneralId", ReferenceTo: "[InformeTFgeneral].[ITFgeneralId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__AdjuntoIT__Proce__5748DA5E", Column: "Procesado", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_AdjuntoId", Type: "Nonclustered", Columns: ["AdjuntoId"] }
            , { Name: "IX_ITFgeneralId", Type: "Nonclustered", Columns: ["ITFgeneralId"] }
            , { Name: "PK_MT.AdjuntoITF", Type: "Clustered", Columns: ["AdjuntoITFId"] }
        ]
    }
    , {
        TableName: "[MT].[AdjuntoITFInsumo]", Description: ""
        , Coumns: [
            { Name: "AdjuntoITFInsumoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "N", Description: "" }
            , { Name: "InsumosId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_MT.AdjuntoITFInsumo_GEN.Adjunto_AdjuntoId", Column: "AdjuntoId", ReferenceTo: "[Adjunto].[AdjuntoId]" }
            , { Name: "FK_MT.AdjuntoITFInsumo_MT.ITFInsumos_InsumosId", Column: "InsumosId", ReferenceTo: "[ITFInsumos].[InsumosId]" }
        ]
        , Indexes: [
            { Name: "IX_AdjuntoId", Type: "Nonclustered", Columns: ["AdjuntoId"] }
            , { Name: "IX_InsumosId", Type: "Nonclustered", Columns: ["InsumosId"] }
            , { Name: "PK_MT.AdjuntoITFInsumo", Type: "Clustered", Columns: ["AdjuntoITFInsumoId"] }
        ]
    }
    , {
        TableName: "[MT].[AutoresCursosPersonal]", Description: ""
        , Coumns: [
            { Name: "AutoresCursosPersonalId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Autor_ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Autor_Nombre", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "CursosPersonalId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_MT.AutoresCursosPersonal_MT.CursosPersonal_CursosPersonalId", Column: "CursosPersonalId", ReferenceTo: "[CursosPersonal].[CursosPersonalId]" }
        ]
        , Indexes: [
            { Name: "IX_CursosPersonalId", Type: "Nonclustered", Columns: ["CursosPersonalId"] }
            , { Name: "PK_MT.AutoresCursosPersonal", Type: "Clustered", Columns: ["AutoresCursosPersonalId"] }
        ]
    }
    , {
        TableName: "[MT].[AutorExternoCapitulo]", Description: ""
        , Coumns: [
            { Name: "AutorExternoCapituloId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "CapitulosId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Institucion", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Contribucion", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_MT.AutorExternoCapitulo_MT.Capitulos_CapitulosId", Column: "CapitulosId", ReferenceTo: "[Capitulos].[CapitulosId]" }
        ]
        , Indexes: [
            { Name: "IX_CapitulosId", Type: "Nonclustered", Columns: ["CapitulosId"] }
            , { Name: "PK_MT.AutorExternoCapitulo", Type: "Clustered", Columns: ["AutorExternoCapituloId"] }
        ]
    }
    , {
        TableName: "[MT].[AutorInternoCapitulo]", Description: ""
        , Coumns: [
            { Name: "AutorInternoCapituloId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "CapitulosId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Contribucion", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NombreCompleto", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_MT.AutorInternoCapitulo_MT.Capitulos_CapitulosId", Column: "CapitulosId", ReferenceTo: "[Capitulos].[CapitulosId]" }
        ]
        , Indexes: [
            { Name: "IX_CapitulosId", Type: "Nonclustered", Columns: ["CapitulosId"] }
            , { Name: "PK_MT.AutorInternoCapitulo", Type: "Clustered", Columns: ["AutorInternoCapituloId"] }
        ]
    }
    , {
        TableName: "[MT].[AutorITF]", Description: ""
        , Coumns: [
            { Name: "AutorITFId", Datatype: "NVARCHAR(256)", Nullable: "N", Description: "" }
            , { Name: "InformeTecnicoFinalId", Datatype: "NVARCHAR(50)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "ClaveAutor", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_MT.AutorITF_MT.InformeTecnicoFinal_InformeTecnicoFinalId", Column: "InformeTecnicoFinalId", ReferenceTo: "[InformeTecnicoFinal].[InformeTecnicoFinalId]" }
        ]
        , Indexes: [
            { Name: "IX_InformeTecnicoFinalId", Type: "Nonclustered", Columns: ["InformeTecnicoFinalId"] }
            , { Name: "PK_MT.AutorITF", Type: "Clustered", Columns: ["AutorITFId"] }
        ]
    }
    , {
        TableName: "[MT].[AutorSoftware]", Description: ""
        , Coumns: [
            { Name: "AutorSoftwareId", Datatype: "BIGINT", Nullable: "N", Description: "" }
            , { Name: "SoftwarePersonalId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClaveAutor", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_MT.AutorSoftware_MT.SoftwarePersonal_SoftwarePersonalId", Column: "SoftwarePersonalId", ReferenceTo: "[SoftwarePersonal].[SoftwarePersonalId]" }
        ]
        , Indexes: [
            { Name: "IX_SoftwarePersonalId", Type: "Nonclustered", Columns: ["SoftwarePersonalId"] }
            , { Name: "PK_MT.AutorSoftware", Type: "Clustered", Columns: ["AutorSoftwareId"] }
        ]
    }
    , {
        TableName: "[MT].[BitacoraITFConsulta]", Description: ""
        , Coumns: [
            { Name: "BitacoraITFConsultaId", Datatype: "BIGINT", Nullable: "N", Description: "" }
            , { Name: "FechaMovimiento", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Ip", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "InformeTecnicoFinalId", Datatype: "NVARCHAR(50)", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_MT.BitacoraITFConsulta_MT.InformeTecnicoFinal_InformeTecnicoFinalId", Column: "InformeTecnicoFinalId", ReferenceTo: "[InformeTecnicoFinal].[InformeTecnicoFinalId]" }
        ]
        , Indexes: [
            { Name: "IX_InformeTecnicoFinalId", Type: "Nonclustered", Columns: ["InformeTecnicoFinalId"] }
            , { Name: "PK_MT.BitacoraITFConsulta", Type: "Clustered", Columns: ["BitacoraITFConsultaId"] }
        ]
    }
    , {
        TableName: "[MT].[BitacoraITFDescarga]", Description: ""
        , Coumns: [
            { Name: "BitacoraITFDescargaId", Datatype: "BIGINT", Nullable: "N", Description: "" }
            , { Name: "FechaMovimiento", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Ip", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "InformeTecnicoFinalId", Datatype: "NVARCHAR(50)", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_MT.BitacoraITFDescarga_MT.InformeTecnicoFinal_InformeTecnicoFinalId", Column: "InformeTecnicoFinalId", ReferenceTo: "[InformeTecnicoFinal].[InformeTecnicoFinalId]" }
        ]
        , Indexes: [
            { Name: "IX_InformeTecnicoFinalId", Type: "Nonclustered", Columns: ["InformeTecnicoFinalId"] }
            , { Name: "PK_MT.BitacoraITFDescarga", Type: "Clustered", Columns: ["BitacoraITFDescargaId"] }
        ]
    }
    , {
        TableName: "[MT].[Capitulos]", Description: ""
        , Coumns: [
            { Name: "CapitulosId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "TituloLibro", Datatype: "NVARCHAR(600)", Nullable: "Y", Description: "" }
            , { Name: "TituloCapitulo", Datatype: "NVARCHAR(600)", Nullable: "Y", Description: "" }
            , { Name: "Editorial", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "ISBN", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "EstadoActivoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Pais", Datatype: "NVARCHAR(300)", Nullable: "Y", Description: "" }
            , { Name: "Year", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "Y", Description: "" }
            , { Name: "EstadoFlujoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaValidacion", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_MT.Capitulos_GEN.Adjunto_AdjuntoId", Column: "AdjuntoId", ReferenceTo: "[Adjunto].[AdjuntoId]" }
            , { Name: "FK_MT.Capitulos_GEN.cat_EstadoFlujo_EstadoFlujoId", Column: "EstadoFlujoId", ReferenceTo: "[cat_EstadoFlujo].[EstadoFlujoId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__Capitulos__Estad__09D45A2B", Column: "EstadoFlujoId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_AdjuntoId", Type: "Nonclustered", Columns: ["AdjuntoId"] }
            , { Name: "IX_EstadoFlujoId", Type: "Nonclustered", Columns: ["EstadoFlujoId"] }
            , { Name: "PK_MT.Capitulos", Type: "Clustered", Columns: ["CapitulosId"] }
        ]
    }
    , {
        TableName: "[MT].[cat_CalificacionCliente]", Description: ""
        , Coumns: [
            { Name: "CalificacionClienteId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "NombreCorto", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaAlta", Datatype: "DATETIME", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_MT.cat_CalificacionCliente", Type: "Clustered", Columns: ["CalificacionClienteId"] }
        ]
    }
    , {
        TableName: "[MT].[cat_CalificacionPersonal]", Description: ""
        , Coumns: [
            { Name: "CalificacionPersonalId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "NombreCorto", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaAlta", Datatype: "DATETIME", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_MT.cat_CalificacionPersonal", Type: "Clustered", Columns: ["CalificacionPersonalId"] }
        ]
    }
    , {
        TableName: "[MT].[cat_CalifResultadosFinancieros]", Description: ""
        , Coumns: [
            { Name: "CalifResultadosFinancierosId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "NombreCorto", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaAlta", Datatype: "DATETIME", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_MT.cat_CalifResultadosFinancieros", Type: "Clustered", Columns: ["CalifResultadosFinancierosId"] }
        ]
    }
    , {
        TableName: "[MT].[cat_EstadoCapitulo]", Description: ""
        , Coumns: [
            { Name: "EstadoCapituloId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaEfectiva", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "DescripcionCorta", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_MT.cat_EstadoCapitulo", Type: "Clustered", Columns: ["EstadoCapituloId"] }
        ]
    }
    , {
        TableName: "[MT].[cat_EstadoITFFlujo]", Description: ""
        , Coumns: [
            { Name: "EstadoITFFlujoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(40)", Nullable: "Y", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_MT.cat_EstadoITFFlujo", Type: "Clustered", Columns: ["EstadoITFFlujoId"] }
        ]
    }
    , {
        TableName: "[MT].[cat_EstadoSolicitud]", Description: ""
        , Coumns: [
            { Name: "EstadoSolicitudId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaEfectiva", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "DescripcionCorta", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "Y", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_MT.cat_EstadoSolicitud", Type: "Clustered", Columns: ["EstadoSolicitudId"] }
        ]
    }
    , {
        TableName: "[MT].[cat_TipoAcceso]", Description: ""
        , Coumns: [
            { Name: "TipoAccesoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "EstadoDisponible", Datatype: "BIT", Nullable: "N", Description: "" }
        ]
        , DefaultConstraints: [
            { Name: "DF__cat_TipoA__Estad__7B863AD4", Column: "EstadoDisponible", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "PK_MT.cat_TipoAcceso", Type: "Clustered", Columns: ["TipoAccesoId"] }
        ]
    }
    , {
        TableName: "[MT].[cat_TipoCurso]", Description: ""
        , Coumns: [
            { Name: "TipoCursoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(600)", Nullable: "N", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "FechaEfectiva", Datatype: "DATETIME", Nullable: "N", Description: "" }
        ]
        , DefaultConstraints: [
            { Name: "DF__cat_TipoC__Descr__30242045", Column: "Descripcion", Value: "('')" }
            , { Name: "DF__cat_TipoC__Fecha__3118447E", Column: "FechaRegistro", Value: "('1900-01-01T00:00:00.000')" }
            , { Name: "DF__cat_TipoC__Fecha__320C68B7", Column: "FechaEfectiva", Value: "('1900-01-01T00:00:00.000')" }
        ]
        , Indexes: [
            { Name: "PK_MT.cat_TipoCurso", Type: "Clustered", Columns: ["TipoCursoId"] }
        ]
    }
    , {
        TableName: "[MT].[cat_TipoSoftware]", Description: ""
        , Coumns: [
            { Name: "TipoSoftwareId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(500)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(600)", Nullable: "N", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "FechaEfectiva", Datatype: "DATETIME", Nullable: "N", Description: "" }
        ]
        , DefaultConstraints: [
            { Name: "DF__cat_TipoS__Descr__33008CF0", Column: "Descripcion", Value: "('')" }
            , { Name: "DF__cat_TipoS__Fecha__33F4B129", Column: "FechaRegistro", Value: "('1900-01-01T00:00:00.000')" }
            , { Name: "DF__cat_TipoS__Fecha__34E8D562", Column: "FechaEfectiva", Value: "('1900-01-01T00:00:00.000')" }
        ]
        , Indexes: [
            { Name: "PK_MT.cat_TipoSoftware", Type: "Clustered", Columns: ["TipoSoftwareId"] }
        ]
    }
    , {
        TableName: "[MT].[CursosPersonal]", Description: ""
        , Coumns: [
            { Name: "CursosPersonalId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ProyectoId", Datatype: "NVARCHAR(20)", Nullable: "N", Description: "" }
            , { Name: "Titulo", Datatype: "NVARCHAR(600)", Nullable: "N", Description: "" }
            , { Name: "FechaCurso", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(1000)", Nullable: "N", Description: "" }
            , { Name: "EstadoActivoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "TipoCursoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaValidacion", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "EstadoFlujoId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_MT.CursosPersonal_GEN.cat_EstadoFlujo_EstadoFlujoId", Column: "EstadoFlujoId", ReferenceTo: "[cat_EstadoFlujo].[EstadoFlujoId]" }
            , { Name: "FK_MT.CursosPersonal_GEN.Proyectos_ProyectoId", Column: "ProyectoId", ReferenceTo: "[Proyectos].[ProyectoId]" }
            , { Name: "FK_MT.CursosPersonal_MT.cat_TipoCurso_TipoCursoId", Column: "TipoCursoId", ReferenceTo: "[cat_TipoCurso].[TipoCursoId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__CursosPer__Estad__3CA9F2BB", Column: "EstadoActivoId", Value: "((0))" }
            , { Name: "DF__CursosPer__Estad__477C86E9", Column: "EstadoFlujoId", Value: "((0))" }
            , { Name: "DF__CursosPer__TipoC__4AF81212", Column: "TipoCursoId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_EstadoFlujoId", Type: "Nonclustered", Columns: ["EstadoFlujoId"] }
            , { Name: "IX_ProyectoId", Type: "Nonclustered", Columns: ["ProyectoId"] }
            , { Name: "IX_TipoCursoId", Type: "Nonclustered", Columns: ["TipoCursoId"] }
            , { Name: "PK_MT.CursosPersonal", Type: "Clustered", Columns: ["CursosPersonalId"] }
        ]
    }
    , {
        TableName: "[MT].[EditoresCapitulo]", Description: ""
        , Coumns: [
            { Name: "EditoresCapituloId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Editor_Nombre", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "CapitulosId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_MT.EditoresCapitulo_MT.Capitulos_CapitulosId", Column: "CapitulosId", ReferenceTo: "[Capitulos].[CapitulosId]" }
        ]
        , Indexes: [
            { Name: "IX_CapitulosId", Type: "Nonclustered", Columns: ["CapitulosId"] }
            , { Name: "PK_MT.EditoresCapitulo", Type: "Clustered", Columns: ["EditoresCapituloId"] }
        ]
    }
    , {
        TableName: "[MT].[InformeBecario]", Description: ""
        , Coumns: [
            { Name: "InformeBecarioId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ProyectoId", Datatype: "NVARCHAR(20)", Nullable: "N", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(600)", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(1000)", Nullable: "N", Description: "" }
            , { Name: "NombreBecario", Datatype: "NVARCHAR(300)", Nullable: "N", Description: "" }
            , { Name: "InstitucionProcedencia", Datatype: "NVARCHAR(600)", Nullable: "N", Description: "" }
            , { Name: "NombreAsesor", Datatype: "NVARCHAR(300)", Nullable: "N", Description: "" }
            , { Name: "InstitucionEstancia", Datatype: "NVARCHAR(600)", Nullable: "N", Description: "" }
            , { Name: "TipoBeca", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "FechaInicio", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "FechaTermino", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Archivos", Datatype: "NVARCHAR(1800)", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_MT.InformeBecario_GEN.Proyectos_ProyectoId", Column: "ProyectoId", ReferenceTo: "[Proyectos].[ProyectoId]" }
        ]
        , Indexes: [
            { Name: "IX_ProyectoId", Type: "Nonclustered", Columns: ["ProyectoId"] }
            , { Name: "PK_MT.InformeBecario", Type: "Clustered", Columns: ["InformeBecarioId"] }
        ]
    }
    , {
        TableName: "[MT].[InformeTecnicoFinal]", Description: ""
        , Coumns: [
            { Name: "ProyectoId", Datatype: "NVARCHAR(20)", Nullable: "N", Description: "" }
            , { Name: "InformeTecnicoFinalId", Datatype: "NVARCHAR(50)", Nullable: "N", Description: "" }
            , { Name: "ResultadosEId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "SatisCteId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "ResultadosId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "ProyFuturoId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "LAcapId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "LActeId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "LAproyId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "ITFgeneralId", Datatype: "NVARCHAR(50)", Nullable: "Y", Description: "" }
            , { Name: "EstadoITFFlujoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "clasificacionSignatura", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "Titulo", Datatype: "VARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "idSigco2", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "idInformeRIIE", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "ultraConfidencial", Datatype: "BIT", Nullable: "Y", Description: "" }
            , { Name: "FechaAutorizacion", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "FechaPublicacion", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "ClaveUnidadOrganizacional", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "AnioElaboracion", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "NumInforme", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "NumInventario", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "ClaveUnidadPadre", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Eliminado", Datatype: "BIT", Nullable: "Y", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_MT.InformeTecnicoFinal_GEN.Adjunto_AdjuntoId", Column: "AdjuntoId", ReferenceTo: "[Adjunto].[AdjuntoId]" }
            , { Name: "FK_MT.InformeTecnicoFinal_GEN.Proyectos_ProyectoId", Column: "ProyectoId", ReferenceTo: "[Proyectos].[ProyectoId]" }
            , { Name: "FK_MT.InformeTecnicoFinal_MT.cat_EstadoITFFlujo_EstadoITFFlujoId", Column: "EstadoITFFlujoId", ReferenceTo: "[cat_EstadoITFFlujo].[EstadoITFFlujoId]" }
            , { Name: "FK_MT.InformeTecnicoFinal_MT.InformeTFgeneral_ITFgeneralId", Column: "ITFgeneralId", ReferenceTo: "[InformeTFgeneral].[ITFgeneralId]" }
            , { Name: "FK_MT.InformeTecnicoFinal_MT.ITFLeccionesAprendidasCapacidad_LAcapId", Column: "LAcapId", ReferenceTo: "[ITFLeccionesAprendidasCapacidad].[LAcapId]" }
            , { Name: "FK_MT.InformeTecnicoFinal_MT.ITFLeccionesAprendidasCliente_LActeId", Column: "LActeId", ReferenceTo: "[ITFLeccionesAprendidasCliente].[LActeId]" }
            , { Name: "FK_MT.InformeTecnicoFinal_MT.ITFLeccionesAprendidasProy_LAproyId", Column: "LAproyId", ReferenceTo: "[ITFLeccionesAprendidasProy].[LAproyId]" }
            , { Name: "FK_MT.InformeTecnicoFinal_MT.ITFProyFuturo_ProyFuturoId", Column: "ProyFuturoId", ReferenceTo: "[ITFProyFuturo].[ProyFuturoId]" }
            , { Name: "FK_MT.InformeTecnicoFinal_MT.ITFResultados_ResultadosId", Column: "ResultadosId", ReferenceTo: "[ITFResultados].[ResultadosId]" }
            , { Name: "FK_MT.InformeTecnicoFinal_MT.ITFResultadosEconomicos_ResultadosEId", Column: "ResultadosEId", ReferenceTo: "[ITFResultadosEconomicos].[ResultadosEId]" }
            , { Name: "FK_MT.InformeTecnicoFinal_MT.ITFSatisfaccionCliente_SatisCteId", Column: "SatisCteId", ReferenceTo: "[ITFSatisfaccionCliente].[SatisCteId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__InformeTe__Estad__04BA9F53", Column: "EstadoITFFlujoId", Value: "((0))" }
            , { Name: "DF__InformeTe__Infor__031C6FA4", Column: "InformeTecnicoFinalId", Value: "('')" }
        ]
        , Indexes: [
            { Name: "IX_AdjuntoId", Type: "Nonclustered", Columns: ["AdjuntoId"] }
            , { Name: "IX_EstadoITFFlujoId", Type: "Nonclustered", Columns: ["EstadoITFFlujoId"] }
            , { Name: "IX_ITFgeneralId", Type: "Nonclustered", Columns: ["ITFgeneralId"] }
            , { Name: "IX_LAcapId", Type: "Nonclustered", Columns: ["LAcapId"] }
            , { Name: "IX_LActeId", Type: "Nonclustered", Columns: ["LActeId"] }
            , { Name: "IX_LAproyId", Type: "Nonclustered", Columns: ["LAproyId"] }
            , { Name: "IX_ProyectoId", Type: "Nonclustered", Columns: ["ProyectoId"] }
            , { Name: "IX_ProyFuturoId", Type: "Nonclustered", Columns: ["ProyFuturoId"] }
            , { Name: "IX_ResultadosEId", Type: "Nonclustered", Columns: ["ResultadosEId"] }
            , { Name: "IX_ResultadosId", Type: "Nonclustered", Columns: ["ResultadosId"] }
            , { Name: "IX_SatisCteId", Type: "Nonclustered", Columns: ["SatisCteId"] }
            , { Name: "PK_MT.InformeTecnicoFinal", Type: "Clustered", Columns: ["InformeTecnicoFinalId"] }
        ]
    }
    , {
        TableName: "[MT].[InformeTFgeneral]", Description: ""
        , Coumns: [
            { Name: "ITFgeneralId", Datatype: "NVARCHAR(50)", Nullable: "N", Description: "" }
            , { Name: "Resumen", Datatype: "VARCHAR(-1)", Nullable: "N", Description: "" }
            , { Name: "AccesoTipo", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_MT.InformeTFgeneral_MT.cat_TipoAcceso_AccesoTipo", Column: "AccesoTipo", ReferenceTo: "[cat_TipoAcceso].[TipoAccesoId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__InformeTF__Acces__7E62A77F", Column: "AccesoTipo", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_AccesoTipo", Type: "Nonclustered", Columns: ["AccesoTipo"] }
            , { Name: "PK_MT.InformeTFgeneral", Type: "Clustered", Columns: ["ITFgeneralId"] }
        ]
    }
    , {
        TableName: "[MT].[ITFEvaluaciones]", Description: ""
        , Coumns: [
            { Name: "EvaluacionesId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "CalifPer", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "IdInformeTecnicoFinal", Datatype: "NVARCHAR(50)", Nullable: "N", Description: "" }
            , { Name: "PersonalProyectoId", Datatype: "BIGINT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_MT.ITFEvaluaciones_GEN.PersonalProyecto_PersonalProyectoId", Column: "PersonalProyectoId", ReferenceTo: "[PersonalProyecto].[PersonalProyectoId]" }
            , { Name: "FK_MT.ITFEvaluaciones_MT.InformeTecnicoFinal_IdInformeTecnicoFinal", Column: "IdInformeTecnicoFinal", ReferenceTo: "[InformeTecnicoFinal].[InformeTecnicoFinalId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__ITFEvalua__Perso__0F183235", Column: "PersonalProyectoId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_IdInformeTecnicoFinal", Type: "Nonclustered", Columns: ["IdInformeTecnicoFinal"] }
            , { Name: "IX_PersonalProyectoId", Type: "Nonclustered", Columns: ["PersonalProyectoId"] }
            , { Name: "PK_MT.ITFEvaluaciones", Type: "Clustered", Columns: ["EvaluacionesId"] }
        ]
    }
    , {
        TableName: "[MT].[ITFInsumos]", Description: ""
        , Coumns: [
            { Name: "InsumosId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NombreIns", Datatype: "NVARCHAR(200)", Nullable: "N", Description: "" }
            , { Name: "DescripcionIns", Datatype: "NVARCHAR(600)", Nullable: "N", Description: "" }
            , { Name: "TipoIns", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ArchivoInsId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ResponsableIns", Datatype: "NVARCHAR(300)", Nullable: "N", Description: "" }
            , { Name: "UbicacionResIns", Datatype: "NVARCHAR(1000)", Nullable: "N", Description: "" }
            , { Name: "TipoAccesoIns", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "InformeTecnicoFinalId", Datatype: "NVARCHAR(50)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_MT.ITFInsumos_MT.cat_TipoAcceso_TipoAccesoIns", Column: "TipoAccesoIns", ReferenceTo: "[cat_TipoAcceso].[TipoAccesoId]" }
            , { Name: "FK_MT.ITFInsumos_MT.InformeTecnicoFinal_InformeTecnicoFinalId", Column: "InformeTecnicoFinalId", ReferenceTo: "[InformeTecnicoFinal].[InformeTecnicoFinalId]" }
            , { Name: "FK_MT.ITFInsumos_MT.TipoInsumo_TipoIns", Column: "TipoIns", ReferenceTo: "[TipoInsumo].[TipoInsumoId]" }
        ]
        , Indexes: [
            { Name: "IX_InformeTecnicoFinalId", Type: "Nonclustered", Columns: ["InformeTecnicoFinalId"] }
            , { Name: "IX_TipoAccesoIns", Type: "Nonclustered", Columns: ["TipoAccesoIns"] }
            , { Name: "IX_TipoIns", Type: "Nonclustered", Columns: ["TipoIns"] }
            , { Name: "PK_MT.ITFInsumos", Type: "Clustered", Columns: ["InsumosId"] }
        ]
    }
    , {
        TableName: "[MT].[ITFLeccionesAprendidasCapacidad]", Description: ""
        , Coumns: [
            { Name: "LAcapId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Instalaciones", Datatype: "NVARCHAR(1000)", Nullable: "N", Description: "" }
            , { Name: "Servicios", Datatype: "NVARCHAR(1000)", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_MT.ITFLeccionesAprendidasCapacidad", Type: "Clustered", Columns: ["LAcapId"] }
        ]
    }
    , {
        TableName: "[MT].[ITFLeccionesAprendidasCliente]", Description: ""
        , Coumns: [
            { Name: "LActeId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Negociacion", Datatype: "NVARCHAR(1000)", Nullable: "N", Description: "" }
            , { Name: "Desarrollo", Datatype: "NVARCHAR(1000)", Nullable: "N", Description: "" }
            , { Name: "Cierre", Datatype: "NVARCHAR(1000)", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_MT.ITFLeccionesAprendidasCliente", Type: "Clustered", Columns: ["LActeId"] }
        ]
    }
    , {
        TableName: "[MT].[ITFLeccionesAprendidasProy]", Description: ""
        , Coumns: [
            { Name: "LAproyId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Insumos", Datatype: "NVARCHAR(1000)", Nullable: "N", Description: "" }
            , { Name: "Equipo", Datatype: "NVARCHAR(1000)", Nullable: "N", Description: "" }
            , { Name: "Gestion", Datatype: "NVARCHAR(1000)", Nullable: "N", Description: "" }
            , { Name: "Clave", Datatype: "NVARCHAR(200)", Nullable: "N", Description: "" }
            , { Name: "Cumplimiento", Datatype: "NVARCHAR(1000)", Nullable: "N", Description: "" }
        ]
        , DefaultConstraints: [
            { Name: "DF__ITFLeccio__Cumpl__6319B466", Column: "Cumplimiento", Value: "('')" }
        ]
        , Indexes: [
            { Name: "PK_MT.ITFLeccionesAprendidasProy", Type: "Clustered", Columns: ["LAproyId"] }
        ]
    }
    , {
        TableName: "[MT].[ITFProyFuturo]", Description: ""
        , Coumns: [
            { Name: "ProyFuturoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(2000)", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_MT.ITFProyFuturo", Type: "Clustered", Columns: ["ProyFuturoId"] }
        ]
    }
    , {
        TableName: "[MT].[ITFResultados]", Description: ""
        , Coumns: [
            { Name: "ResultadosId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(2000)", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_MT.ITFResultados", Type: "Clustered", Columns: ["ResultadosId"] }
        ]
    }
    , {
        TableName: "[MT].[ITFResultadosEconomicos]", Description: ""
        , Coumns: [
            { Name: "ResultadosEId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "CalifResE", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_MT.ITFResultadosEconomicos_MT.cat_CalifResultadosFinancieros_CalifResE", Column: "CalifResE", ReferenceTo: "[cat_CalifResultadosFinancieros].[CalifResultadosFinancierosId]" }
        ]
        , Indexes: [
            { Name: "IX_CalifResE", Type: "Nonclustered", Columns: ["CalifResE"] }
            , { Name: "PK_MT.ITFResultadosEconomicos", Type: "Clustered", Columns: ["ResultadosEId"] }
        ]
    }
    , {
        TableName: "[MT].[ITFSatisfaccionCliente]", Description: ""
        , Coumns: [
            { Name: "SatisCteId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Justificacion", Datatype: "NVARCHAR(1000)", Nullable: "N", Description: "" }
            , { Name: "CalificacionClienteId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_MT.ITFSatisfaccionCliente_MT.cat_CalificacionCliente_CalificacionClienteId", Column: "CalificacionClienteId", ReferenceTo: "[cat_CalificacionCliente].[CalificacionClienteId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__ITFSatisf__Calif__74444068", Column: "CalificacionClienteId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_CalificacionClienteId", Type: "Nonclustered", Columns: ["CalificacionClienteId"] }
            , { Name: "PK_MT.ITFSatisfaccionCliente", Type: "Clustered", Columns: ["SatisCteId"] }
        ]
    }
    , {
        TableName: "[MT].[LibroDescriptores]", Description: ""
        , Coumns: [
            { Name: "Descriptor", Datatype: "NVARCHAR(256)", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_MT.LibroDescriptores", Type: "Clustered", Columns: ["Descriptor"] }
        ]
    }
    , {
        TableName: "[MT].[LibroInventarios]", Description: ""
        , Coumns: [
            { Name: "NoInventario", Datatype: "NVARCHAR(256)", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_MT.LibroInventarios", Type: "Clustered", Columns: ["NoInventario"] }
        ]
    }
    , {
        TableName: "[MT].[Libros]", Description: ""
        , Coumns: [
            { Name: "LibrosId", Datatype: "NVARCHAR(256)", Nullable: "N", Description: "" }
            , { Name: "Clasificacion", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Titulo", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "PieImprenta", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "TipoMaterial", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "ISBN", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Serie", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_MT.Libros", Type: "Clustered", Columns: ["LibrosId"] }
        ]
    }
    , {
        TableName: "[MT].[LibrosAutores]", Description: ""
        , Coumns: [
            { Name: "Autor", Datatype: "NVARCHAR(300)", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_MT.LibrosAutores", Type: "Clustered", Columns: ["Autor"] }
        ]
    }
    , {
        TableName: "[MT].[SoftwarePersonal]", Description: ""
        , Coumns: [
            { Name: "SoftwarePersonalId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ProyectoId", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "Nombre", Datatype: "VARCHAR(-1)", Nullable: "N", Description: "" }
            , { Name: "NumeroVersion", Datatype: "REAL", Nullable: "Y", Description: "" }
            , { Name: "AnioVersion", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "DescripcionFuncional", Datatype: "VARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "PlataformaDesarrollo", Datatype: "VARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "TipoSoftwareId", Datatype: "INT", Nullable: "Y", Description: "" }
            , { Name: "DerechoAutor", Datatype: "VARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Comentarios", Datatype: "VARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "ManualTecnico", Datatype: "BIGINT", Nullable: "Y", Description: "" }
            , { Name: "ManualUsuario", Datatype: "BIGINT", Nullable: "Y", Description: "" }
            , { Name: "CodigoFuente", Datatype: "BIGINT", Nullable: "Y", Description: "" }
            , { Name: "TipoAcceso", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "BIT", Nullable: "N", Description: "" }
            , { Name: "GerenciaClave", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "FechaValidacion", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "EstadoFlujoId", Datatype: "INT", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_MT.SoftwarePersonal_GEN.Adjunto_CodigoFuente", Column: "CodigoFuente", ReferenceTo: "[Adjunto].[AdjuntoId]" }
            , { Name: "FK_MT.SoftwarePersonal_GEN.Adjunto_ManualTecnico", Column: "ManualTecnico", ReferenceTo: "[Adjunto].[AdjuntoId]" }
            , { Name: "FK_MT.SoftwarePersonal_GEN.Adjunto_ManualUsuario", Column: "ManualUsuario", ReferenceTo: "[Adjunto].[AdjuntoId]" }
            , { Name: "FK_MT.SoftwarePersonal_GEN.cat_EstadoFlujo_EstadoFlujoId", Column: "EstadoFlujoId", ReferenceTo: "[cat_EstadoFlujo].[EstadoFlujoId]" }
            , { Name: "FK_MT.SoftwarePersonal_GEN.Proyectos_ProyectoId", Column: "ProyectoId", ReferenceTo: "[Proyectos].[ProyectoId]" }
            , { Name: "FK_MT.SoftwarePersonal_MT.cat_TipoAcceso_TipoAcceso", Column: "TipoAcceso", ReferenceTo: "[cat_TipoAcceso].[TipoAccesoId]" }
            , { Name: "FK_MT.SoftwarePersonal_MT.cat_TipoSoftware_TipoSoftwareId", Column: "TipoSoftwareId", ReferenceTo: "[cat_TipoSoftware].[TipoSoftwareId]" }
        ]
        , Indexes: [
            { Name: "IX_CodigoFuente", Type: "Nonclustered", Columns: ["CodigoFuente"] }
            , { Name: "IX_EstadoFlujoId", Type: "Nonclustered", Columns: ["EstadoFlujoId"] }
            , { Name: "IX_ManualTecnico", Type: "Nonclustered", Columns: ["ManualTecnico"] }
            , { Name: "IX_ManualUsuario", Type: "Nonclustered", Columns: ["ManualUsuario"] }
            , { Name: "IX_ProyectoId", Type: "Nonclustered", Columns: ["ProyectoId"] }
            , { Name: "IX_TipoAcceso", Type: "Nonclustered", Columns: ["TipoAcceso"] }
            , { Name: "IX_TipoSoftwareId", Type: "Nonclustered", Columns: ["TipoSoftwareId"] }
            , { Name: "PK_MT.SoftwarePersonal", Type: "Clustered", Columns: ["SoftwarePersonalId"] }
        ]
    }
    , {
        TableName: "[MT].[SolicitudAccesoITF]", Description: ""
        , Coumns: [
            { Name: "SolicitudAccesoITFId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "InformeTecnicoFinalId", Datatype: "NVARCHAR(50)", Nullable: "Y", Description: "" }
            , { Name: "ClavePersonaSolicitante", Datatype: "NVARCHAR(20)", Nullable: "N", Description: "" }
            , { Name: "ClaveUnidadDelSolicitante", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "EstadoFlujoId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_MT.SolicitudAccesoITF_GEN.cat_EstadoFlujo_EstadoFlujoId", Column: "EstadoFlujoId", ReferenceTo: "[cat_EstadoFlujo].[EstadoFlujoId]" }
            , { Name: "FK_MT.SolicitudAccesoITF_MT.InformeTecnicoFinal_InformeTecnicoFinalId", Column: "InformeTecnicoFinalId", ReferenceTo: "[InformeTecnicoFinal].[InformeTecnicoFinalId]" }
        ]
        , Indexes: [
            { Name: "IX_EstadoFlujoId", Type: "Nonclustered", Columns: ["EstadoFlujoId"] }
            , { Name: "IX_InformeTecnicoFinalId", Type: "Nonclustered", Columns: ["InformeTecnicoFinalId"] }
            , { Name: "PK_MT.SolicitudAccesoITF", Type: "Clustered", Columns: ["SolicitudAccesoITFId"] }
        ]
    }
    , {
        TableName: "[MT].[SolicitudInsumo]", Description: ""
        , Coumns: [
            { Name: "SolicitudInsumoId", Datatype: "BIGINT", Nullable: "N", Description: "" }
            , { Name: "InsumosId", Datatype: "BIGINT", Nullable: "N", Description: "" }
            , { Name: "ClavePersonaSolicitante", Datatype: "NVARCHAR(20)", Nullable: "N", Description: "" }
            , { Name: "FechaSolicitudInsumo", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Justificacion", Datatype: "NVARCHAR(1000)", Nullable: "N", Description: "" }
            , { Name: "ClavePersonaAutorizador", Datatype: "NVARCHAR(20)", Nullable: "N", Description: "" }
            , { Name: "FechaAtencion", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "TextoRespuesta", Datatype: "NVARCHAR(1000)", Nullable: "Y", Description: "" }
            , { Name: "FechaInicioDescarga", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "FechaFinalDescarga", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "EstadoSolicitudId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_MT.tSolicitudInsumo_MT.cat_EstadoSolicitud_EstadoSolicitudId", Column: "EstadoSolicitudId", ReferenceTo: "[cat_EstadoSolicitud].[EstadoSolicitudId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tSolicitu__Estad__07CC1628", Column: "EstadoSolicitudId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_EstadoSolicitudId", Type: "Nonclustered", Columns: ["EstadoSolicitudId"] }
            , { Name: "PK_MT.tSolicitudInsumo", Type: "Clustered", Columns: ["SolicitudInsumoId"] }
        ]
    }
    , {
        TableName: "[MT].[SolicitudRevisionITF]", Description: ""
        , Coumns: [
            { Name: "SolicitudRevisionITFId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "InformeTecnicoFinalId", Datatype: "NVARCHAR(50)", Nullable: "Y", Description: "" }
            , { Name: "ClavePersonaSolicitante", Datatype: "NVARCHAR(20)", Nullable: "N", Description: "" }
            , { Name: "FechaSolicitud", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "Justificacion", Datatype: "NVARCHAR(1000)", Nullable: "Y", Description: "" }
            , { Name: "EstadoSolicitudId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClaveUnidad", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "FechaAtencion", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "TextoRespuesta", Datatype: "NVARCHAR(1000)", Nullable: "Y", Description: "" }
            , { Name: "AdminMT", Datatype: "BIT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_MT.SolicitudRevisionITF_MT.cat_EstadoSolicitud_EstadoSolicitudId", Column: "EstadoSolicitudId", ReferenceTo: "[cat_EstadoSolicitud].[EstadoSolicitudId]" }
            , { Name: "FK_MT.SolicitudRevisionITF_MT.InformeTecnicoFinal_InformeTecnicoFinalId", Column: "InformeTecnicoFinalId", ReferenceTo: "[InformeTecnicoFinal].[InformeTecnicoFinalId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__Solicitud__Admin__5C77A3CF", Column: "AdminMT", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_EstadoSolicitudId", Type: "Nonclustered", Columns: ["EstadoSolicitudId"] }
            , { Name: "IX_InformeTecnicoFinalId", Type: "Nonclustered", Columns: ["InformeTecnicoFinalId"] }
            , { Name: "PK_MT.SolicitudRevisionITF", Type: "Clustered", Columns: ["SolicitudRevisionITFId"] }
        ]
    }
    , {
        TableName: "[MT].[TipoInsumo]", Description: ""
        , Coumns: [
            { Name: "TipoInsumoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "DescripcionInsumo", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "EstadoDisponible", Datatype: "BIT", Nullable: "N", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_MT.TipoInsumo", Type: "Clustered", Columns: ["TipoInsumoId"] }
        ]
    }
    , {
        TableName: "[PI].[cat_RamaDA]", Description: ""
        , Coumns: [
            { Name: "RamaDAId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_PI.cat_RamaDA", Type: "Clustered", Columns: ["RamaDAId"] }
        ]
    }
    , {
        TableName: "[PI].[cat_TipoDerivadaDA]", Description: ""
        , Coumns: [
            { Name: "TipoDerivadaDAId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_PI.cat_TipoDerivadaDA", Type: "Clustered", Columns: ["TipoDerivadaDAId"] }
        ]
    }
    , {
        TableName: "[PI].[cat_TipoEmpleado]", Description: ""
        , Coumns: [
            { Name: "TipoEmpleadoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Clave", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_PI.cat_TipoEmpleado", Type: "Clustered", Columns: ["TipoEmpleadoId"] }
        ]
    }
    , {
        TableName: "[PI].[cat_TipoPI]", Description: ""
        , Coumns: [
            { Name: "TipoPIId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Descripcion", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_PI.cat_TipoPI", Type: "Clustered", Columns: ["TipoPIId"] }
        ]
    }
    , {
        TableName: "[PI].[tab_AutoresExtDA]", Description: ""
        , Coumns: [
            { Name: "AutoresExtDAId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "DAExternoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Institucion", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Contribucion", Datatype: "REAL", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_AutoresExtDA_PI.tab_DAExterno_DAExternoId", Column: "DAExternoId", ReferenceTo: "[tab_DAExterno].[DAExternoId]" }
        ]
        , Indexes: [
            { Name: "IX_DAExternoId", Type: "Nonclustered", Columns: ["DAExternoId"] }
            , { Name: "PK_CH.tab_AutoresExtDA", Type: "Clustered", Columns: ["AutoresExtDAId"] }
        ]
    }
    , {
        TableName: "[PI].[tab_AutoresExtPIPatrimonio]", Description: ""
        , Coumns: [
            { Name: "AutoresExtPIPatrimonioId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "RequisicionesPIId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_PI.tab_AutoresExtPIPatrimonio_PI.tab_RequisicionesPI_RequisicionesPIId", Column: "RequisicionesPIId", ReferenceTo: "[tab_RequisicionesPI].[RequisicionesPIId]" }
        ]
        , Indexes: [
            { Name: "IX_RequisicionesPIId", Type: "Nonclustered", Columns: ["RequisicionesPIId"] }
            , { Name: "PK_PI.tab_AutoresExtPIPatrimonio", Type: "Clustered", Columns: ["AutoresExtPIPatrimonioId"] }
        ]
    }
    , {
        TableName: "[PI].[tab_AutoresIndustrialExt]", Description: ""
        , Coumns: [
            { Name: "AutoresIndustrialExtId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "PIExternoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Institucion", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Contribucion", Datatype: "REAL", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_PI.tab_AutoresIndustrialExt_PI.tab_PIExterno_PIExternoId", Column: "PIExternoId", ReferenceTo: "[tab_PIExterno].[PIExternoId]" }
        ]
        , Indexes: [
            { Name: "IX_PIExternoId", Type: "Nonclustered", Columns: ["PIExternoId"] }
            , { Name: "PK_PI.tab_AutoresIndustrialExt", Type: "Clustered", Columns: ["AutoresIndustrialExtId"] }
        ]
    }
    , {
        TableName: "[PI].[tab_AutoresIndustrialInt]", Description: ""
        , Coumns: [
            { Name: "AutoresIndustrialIntId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "PIExternoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Contribucion", Datatype: "REAL", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_PI.tab_AutoresIndustrialInt_PI.tab_PIExterno_PIExternoId", Column: "PIExternoId", ReferenceTo: "[tab_PIExterno].[PIExternoId]" }
        ]
        , Indexes: [
            { Name: "IX_PIExternoId", Type: "Nonclustered", Columns: ["PIExternoId"] }
            , { Name: "PK_PI.tab_AutoresIndustrialInt", Type: "Clustered", Columns: ["AutoresIndustrialIntId"] }
        ]
    }
    , {
        TableName: "[PI].[tab_AutoresIntDA]", Description: ""
        , Coumns: [
            { Name: "AutoresIntDAId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "DAExternoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Contribucion", Datatype: "REAL", Nullable: "N", Description: "" }
            , { Name: "Estado", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_CH.tab_AutoresIntDA_PI.tab_DAExterno_DAExternoId", Column: "DAExternoId", ReferenceTo: "[tab_DAExterno].[DAExternoId]" }
        ]
        , Indexes: [
            { Name: "IX_DAExternoId", Type: "Nonclustered", Columns: ["DAExternoId"] }
            , { Name: "PK_CH.tab_AutoresIntDA", Type: "Clustered", Columns: ["AutoresIntDAId"] }
        ]
    }
    , {
        TableName: "[PI].[tab_AutoresIntDAPatrimonio]", Description: ""
        , Coumns: [
            { Name: "ClaveUnidad", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "FechaEfectiva", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "AutoresIntDAPatrimonioId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "TipoEmpleadoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ApellidoPaterno", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "ApellidoMaterno", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "FechaNacimiento", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "LugarNacimiento", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "Nacionalidad", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "RFC", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "CorreoElectronico", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "Telefono", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "Fax", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "Calle", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "NumeroExterior", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "NumeroInterior", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "Colonia", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "Municipio", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "CP", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "Pais", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "EntidadFederativa", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "TipoBecaId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NumeroBecario", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "CategoriaId", Datatype: "NVARCHAR(256)", Nullable: "Y", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_PI.tab_AutoresIntDAPatrimonio_CH.cat_TipoBecas_TipoBecaId", Column: "TipoBecaId", ReferenceTo: "[cat_TipoBecas].[TipoBecaId]" }
            , { Name: "FK_PI.tab_AutoresIntDAPatrimonio_GEN.cat_Categoria_CategoriaId", Column: "CategoriaId", ReferenceTo: "[cat_Categoria].[CategoriaId]" }
            , { Name: "FK_PI.tab_AutoresIntDAPatrimonio_PI.cat_TipoEmpleado_TipoEmpleadoId", Column: "TipoEmpleadoId", ReferenceTo: "[cat_TipoEmpleado].[TipoEmpleadoId]" }
        ]
        , Indexes: [
            { Name: "IX_CategoriaId", Type: "Nonclustered", Columns: ["CategoriaId"] }
            , { Name: "IX_TipoBecaId", Type: "Nonclustered", Columns: ["TipoBecaId"] }
            , { Name: "IX_TipoEmpleadoId", Type: "Nonclustered", Columns: ["TipoEmpleadoId"] }
            , { Name: "PK_PI.tab_AutoresIntDAPatrimonio", Type: "Clustered", Columns: ["AutoresIntDAPatrimonioId"] }
        ]
    }
    , {
        TableName: "[PI].[tab_AutoresIntPIPatrimonio]", Description: ""
        , Coumns: [
            { Name: "AutoresIntPIPatrimonioId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "RequisicionesPIId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_PI.tab_AutoresIntPIPatrimonio_PI.tab_RequisicionesPI_RequisicionesPIId", Column: "RequisicionesPIId", ReferenceTo: "[tab_RequisicionesPI].[RequisicionesPIId]" }
        ]
        , Indexes: [
            { Name: "IX_RequisicionesPIId", Type: "Nonclustered", Columns: ["RequisicionesPIId"] }
            , { Name: "PK_PI.tab_AutoresIntPIPatrimonio", Type: "Clustered", Columns: ["AutoresIntPIPatrimonioId"] }
        ]
    }
    , {
        TableName: "[PI].[tab_DAExterno]", Description: ""
        , Coumns: [
            { Name: "DAExternoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Titulo", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Sintesis", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "RamaDAId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Indautor", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "FechaCertificado", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "Y", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "FechaValidacion", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "EstadoFlujoId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_PI.tab_DAExterno_GEN.Adjunto_AdjuntoId", Column: "AdjuntoId", ReferenceTo: "[Adjunto].[AdjuntoId]" }
            , { Name: "FK_PI.tab_DAExterno_GEN.cat_EstadoFlujo_EstadoFlujoId", Column: "EstadoFlujoId", ReferenceTo: "[cat_EstadoFlujo].[EstadoFlujoId]" }
            , { Name: "FK_PI.tab_DAExterno_PI.cat_RamaDA_RamaDAId", Column: "RamaDAId", ReferenceTo: "[cat_RamaDA].[RamaDAId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_DAExt__Estad__691284DE", Column: "EstadoFlujoId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_AdjuntoId", Type: "Nonclustered", Columns: ["AdjuntoId"] }
            , { Name: "IX_EstadoFlujoId", Type: "Nonclustered", Columns: ["EstadoFlujoId"] }
            , { Name: "IX_RamaDAId", Type: "Nonclustered", Columns: ["RamaDAId"] }
            , { Name: "PK_PI.tab_DAExterno", Type: "Clustered", Columns: ["DAExternoId"] }
        ]
    }
    , {
        TableName: "[PI].[tab_PIExterno]", Description: ""
        , Coumns: [
            { Name: "PIExternoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "FechaValidacion", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "EstadoFlujoId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Titulo", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "Estado", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "NumSolicitudTitulo", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "FechaPresentacion", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "NumExpedicionTitulo", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaExpedicionTitulo", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "AdjuntoId", Datatype: "BIGINT", Nullable: "Y", Description: "" }
            , { Name: "TipoPIId", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_PI.tab_PIExterno_GEN.Adjunto_AdjuntoId", Column: "AdjuntoId", ReferenceTo: "[Adjunto].[AdjuntoId]" }
            , { Name: "FK_PI.tab_PIExterno_GEN.cat_EstadoFlujo_EstadoFlujoId", Column: "EstadoFlujoId", ReferenceTo: "[cat_EstadoFlujo].[EstadoFlujoId]" }
            , { Name: "FK_PI.tab_PIExterno_PI.cat_TipoPI_TipoPIId", Column: "TipoPIId", ReferenceTo: "[cat_TipoPI].[TipoPIId]" }
        ]
        , DefaultConstraints: [
            { Name: "DF__tab_PIExt__TipoP__1308BEAA", Column: "TipoPIId", Value: "((0))" }
        ]
        , Indexes: [
            { Name: "IX_AdjuntoId", Type: "Nonclustered", Columns: ["AdjuntoId"] }
            , { Name: "IX_EstadoFlujoId", Type: "Nonclustered", Columns: ["EstadoFlujoId"] }
            , { Name: "IX_TipoPIId", Type: "Nonclustered", Columns: ["TipoPIId"] }
            , { Name: "PK_PI.tab_PIExterno", Type: "Clustered", Columns: ["PIExternoId"] }
        ]
    }
    , {
        TableName: "[PI].[tab_RequisicionesPI]", Description: ""
        , Coumns: [
            { Name: "ClaveUnidad", Datatype: "NVARCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "FechaEfectiva", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "RequisicionesPIId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NumSolicitud", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "TipoPIId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Titulo", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "NumSolicitudIMPI", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "NumTituloIMPI", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "FechaPresentacion", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "FechaRecepcionTitulo", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "FechaSolicitud", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "FechaExamenFormaRecibido", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "FechaExamenFondoRecibido", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "FechaExpidicionTitulo", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "DivicionId", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , FKs: [
            { Name: "FK_PI.tab_RequisicionesPI_GEN.cat_UnidadOrganizacional_ClaveUnidad_FechaEfectiva", Column: "ClaveUnidad", ReferenceTo: "[cat_UnidadOrganizacional].[ClaveUnidad]" }
            , { Name: "FK_PI.tab_RequisicionesPI_GEN.cat_UnidadOrganizacional_ClaveUnidad_FechaEfectiva", Column: "FechaEfectiva", ReferenceTo: "[cat_UnidadOrganizacional].[FechaEfectiva]" }
            , { Name: "FK_PI.tab_RequisicionesPI_PI.cat_TipoPI_TipoPIId", Column: "TipoPIId", ReferenceTo: "[cat_TipoPI].[TipoPIId]" }
        ]
        , Indexes: [
            { Name: "IX_ClaveUnidad_FechaEfectiva", Type: "Nonclustered", Columns: ["ClaveUnidad", "FechaEfectiva"] }
            , { Name: "IX_TipoPIId", Type: "Nonclustered", Columns: ["TipoPIId"] }
            , { Name: "PK_PI.tab_RequisicionesPI", Type: "Clustered", Columns: ["RequisicionesPIId"] }
        ]
    }
    , {
        TableName: "[PI].[tab_SolicitudesDA]", Description: ""
        , Coumns: [
            { Name: "SolicitudesDAId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "NumeroSolicitud", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Fecha", Datatype: "DATETIME", Nullable: "N", Description: "" }
            , { Name: "ClavePersona", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "TituloObra", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
            , { Name: "SintesisObra", Datatype: "NVARCHAR(400)", Nullable: "Y", Description: "" }
            , { Name: "RamaDAId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "DadoConocer", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "FechaConocer", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "Primigenia", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Derivada", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "TipoDerivadaDAId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "TituloPrimigenia", Datatype: "NVARCHAR(280)", Nullable: "Y", Description: "" }
            , { Name: "Comentarios", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "FechaRegistro", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "RegistroPublico", Datatype: "NVARCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "ComentarioRegistro", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "Monto", Datatype: "REAL", Nullable: "Y", Description: "" }
            , { Name: "FechaCertificacion", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "ComentarioCertificacion", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "Legajo", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "Anaquel", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "Seccion", Datatype: "NVARCHAR(200)", Nullable: "Y", Description: "" }
            , { Name: "FechaUbicacion", Datatype: "DATETIME", Nullable: "Y", Description: "" }
            , { Name: "ComentarioUbicacion", Datatype: "NVARCHAR(1000)", Nullable: "Y", Description: "" }
            , { Name: "CorreoEnviadoGerentes", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_PI.tab_SolicitudesDA_PI.cat_RamaDA_RamaDAId", Column: "RamaDAId", ReferenceTo: "[cat_RamaDA].[RamaDAId]" }
            , { Name: "FK_PI.tab_SolicitudesDA_PI.cat_TipoDerivadaDA_TipoDerivadaDAId", Column: "TipoDerivadaDAId", ReferenceTo: "[cat_TipoDerivadaDA].[TipoDerivadaDAId]" }
        ]
        , Indexes: [
            { Name: "IX_RamaDAId", Type: "Nonclustered", Columns: ["RamaDAId"] }
            , { Name: "IX_TipoDerivadaDAId", Type: "Nonclustered", Columns: ["TipoDerivadaDAId"] }
            , { Name: "PK_PI.tab_SolicitudesDA", Type: "Clustered", Columns: ["SolicitudesDAId"] }
        ]
    }
    , {
        TableName: "[PI].[tab_SolicitudParticiantesDA]", Description: ""
        , Coumns: [
            { Name: "SolicitudParticiantesDAId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "SolicitudesDAId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "AutoresIntDAPatrimonioId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "TipoParticipacionDAId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Porcentaje", Datatype: "INT", Nullable: "N", Description: "" }
        ]
        , FKs: [
            { Name: "FK_PI.tab_SolicitudParticiantesDA_PI.tab_AutoresIntDAPatrimonio_AutoresIntDAPatrimonioId", Column: "AutoresIntDAPatrimonioId", ReferenceTo: "[tab_AutoresIntDAPatrimonio].[AutoresIntDAPatrimonioId]" }
            , { Name: "FK_PI.tab_SolicitudParticiantesDA_PI.tab_SolicitudesDA_SolicitudesDAId", Column: "SolicitudesDAId", ReferenceTo: "[tab_SolicitudesDA].[SolicitudesDAId]" }
            , { Name: "FK_PI.tab_SolicitudParticiantesDA_PI.tab_TipoParticipacionDA_TipoParticipacionDAId", Column: "TipoParticipacionDAId", ReferenceTo: "[tab_TipoParticipacionDA].[TipoParticipacionDAId]" }
        ]
        , Indexes: [
            { Name: "IX_AutoresIntDAPatrimonioId", Type: "Nonclustered", Columns: ["AutoresIntDAPatrimonioId"] }
            , { Name: "IX_SolicitudesDAId", Type: "Nonclustered", Columns: ["SolicitudesDAId"] }
            , { Name: "IX_TipoParticipacionDAId", Type: "Nonclustered", Columns: ["TipoParticipacionDAId"] }
            , { Name: "PK_PI.tab_SolicitudParticiantesDA", Type: "Clustered", Columns: ["SolicitudParticiantesDAId"] }
        ]
    }
    , {
        TableName: "[PI].[tab_TipoParticipacionDA]", Description: ""
        , Coumns: [
            { Name: "TipoParticipacionDAId", Datatype: "INT", Nullable: "N", Description: "" }
            , { Name: "Nombre", Datatype: "NVARCHAR(-1)", Nullable: "Y", Description: "" }
        ]
        , Indexes: [
            { Name: "PK_PI.tab_TipoParticipacionDA", Type: "Clustered", Columns: ["TipoParticipacionDAId"] }
        ]
    }
    , {
        TableName: "[pontigo].[autor]", Description: ""
        , Coumns: [
            { Name: "idAutor", Datatype: "NCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "idInforme", Datatype: "NCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "idEmpleado", Datatype: "NCHAR(20)", Nullable: "Y", Description: "" }
        ]
    }
    , {
        TableName: "[pontigo].[departamentos]", Description: ""
        , Coumns: [
            { Name: "iddepto", Datatype: "NCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "ndepto", Datatype: "NCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "nombredpto", Datatype: "NCHAR(600)", Nullable: "Y", Description: "" }
            , { Name: "statusdpto", Datatype: "NCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "ndptoanterior", Datatype: "NCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "nombredptoanterior", Datatype: "NCHAR(600)", Nullable: "Y", Description: "" }
            , { Name: "iddivision", Datatype: "NCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "fcambiodpto", Datatype: "DATE", Nullable: "Y", Description: "" }
        ]
    }
    , {
        TableName: "[pontigo].[proyectos]", Description: ""
        , Coumns: [
            { Name: "idproyecto", Datatype: "NCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "nproyecto", Datatype: "NCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "nombreproy", Datatype: "NCHAR(600)", Nullable: "Y", Description: "" }
            , { Name: "idprograma", Datatype: "NCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "nsubprograma", Datatype: "NCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "iddepto", Datatype: "NCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "finicio", Datatype: "DATE", Nullable: "Y", Description: "" }
            , { Name: "ftermino", Datatype: "DATE", Nullable: "Y", Description: "" }
            , { Name: "contrato", Datatype: "NCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "divisionoriginal", Datatype: "NCHAR(100)", Nullable: "Y", Description: "" }
            , { Name: "idhistorial", Datatype: "NCHAR(100)", Nullable: "Y", Description: "" }
        ]
    }
    , {
        TableName: "[pontigo].[proyectoSIGA]", Description: ""
        , Coumns: [
            { Name: "numProy", Datatype: "NCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "TituloProyecto", Datatype: "NVARCHAR(700)", Nullable: "Y", Description: "" }
            , { Name: "subprograma", Datatype: "NCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "idSeccion", Datatype: "NCHAR(20)", Nullable: "Y", Description: "" }
            , { Name: "ProyInvestigyDesarrollo", Datatype: "BIT", Nullable: "Y", Description: "" }
            , { Name: "Fecha_inicio", Datatype: "DATE", Nullable: "Y", Description: "" }
            , { Name: "Fecha_termino", Datatype: "DATE", Nullable: "Y", Description: "" }
        ]
    }
]
