namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FamiliaPuestos2 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CH.cat_CategoriasPorFamilia",
                c => new
                    {
                        CategoriaId = c.Int(nullable: false, identity: true),
                        NombreCategoria = c.String(maxLength: 100),
                        Descripcion = c.String(maxLength: 200),
                        Periodo = c.String(maxLength: 4),
                        Estado = c.Int(nullable: false),
                        FamiliaId = c.Int(),
                    })
                .PrimaryKey(t => t.CategoriaId)
                .ForeignKey("CH.tab_FamiliaPuestos", t => t.FamiliaId)
                .Index(t => t.FamiliaId);
            
            CreateTable(
                "CH.tab_FamiliaPuestos",
                c => new
                    {
                        FamiliaId = c.Int(nullable: false, identity: true),
                        NombreFamilia = c.String(maxLength: 100),
                        Descripcion = c.String(maxLength: 200),
                        periodo = c.String(maxLength: 4),
                        estado = c.Int(nullable: false),
                        TipoCompetenciaId = c.Int(nullable: false),
                        TipoNivel = c.Int(),
                        TipoArea_TipoAreaId = c.Int(),
                    })
                .PrimaryKey(t => t.FamiliaId)
                .ForeignKey("CH.cat_TipoArea", t => t.TipoArea_TipoAreaId)
                .ForeignKey("CH.cat_TipoCompetencia", t => t.TipoCompetenciaId, cascadeDelete: true)
                .Index(t => t.TipoCompetenciaId)
                .Index(t => t.TipoArea_TipoAreaId);
            
            CreateTable(
                "CH.cat_TipoArea",
                c => new
                    {
                        TipoAreaId = c.Int(nullable: false, identity: true),
                        Area = c.String(maxLength: 4),
                        Descripcion = c.String(maxLength: 200),
                        Periodo = c.String(maxLength: 4),
                        Estado = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.TipoAreaId);
            
            CreateTable(
                "CH.cat_TipoCompetencia",
                c => new
                    {
                        TipoCompetenciaId = c.Int(nullable: false, identity: true),
                        NombreCompetencia = c.String(maxLength: 50),
                        Descripcion = c.String(maxLength: 200),
                        estado = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.TipoCompetenciaId);
            
            CreateTable(
                "CH.tab_Competencias",
                c => new
                    {
                        CompetenciaId = c.Int(nullable: false, identity: true),
                        Descripcion = c.String(maxLength: 200),
                        Periodo = c.String(maxLength: 4),
                        Estado = c.Int(nullable: false),
                        TipoCompetenciaID = c.Int(),
                        TipoAreaID = c.Int(),
                    })
                .PrimaryKey(t => t.CompetenciaId)
                .ForeignKey("CH.cat_TipoArea", t => t.TipoAreaID)
                .ForeignKey("CH.cat_TipoCompetencia", t => t.TipoCompetenciaID)
                .Index(t => t.TipoCompetenciaID)
                .Index(t => t.TipoAreaID);
            
            CreateTable(
                "CH.cat_DescripcionComportamiento",
                c => new
                    {
                        DescComportamientoId = c.Int(nullable: false, identity: true),
                        Descripcion = c.String(maxLength: 300),
                        Periodo = c.String(maxLength: 4),
                        Estado = c.Int(nullable: false),
                        CompetenciaID = c.Int(),
                        NivelId = c.Int(),
                        NivelCompetencias_NivelCompetenciaId = c.Int(),
                    })
                .PrimaryKey(t => t.DescComportamientoId)
                .ForeignKey("CH.tab_Competencias", t => t.CompetenciaID)
                .ForeignKey("CH.cat_NivelesCompetencias", t => t.NivelCompetencias_NivelCompetenciaId)
                .Index(t => t.CompetenciaID)
                .Index(t => t.NivelCompetencias_NivelCompetenciaId);
            
            CreateTable(
                "CH.cat_NivelesCompetencias",
                c => new
                    {
                        NivelCompetenciaId = c.Int(nullable: false, identity: true),
                        Descripcion = c.String(maxLength: 200),
                        Periodo = c.String(maxLength: 4),
                        Estado = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.NivelCompetenciaId);
            
            CreateTable(
                "CH.cat_DescripcionNiveles",
                c => new
                    {
                        descNivelId = c.Int(nullable: false, identity: true),
                        Descripcion = c.String(maxLength: 300),
                        Periodo = c.String(maxLength: 4),
                        Estado = c.Int(nullable: false),
                        CompetenciaID = c.Int(),
                        nivelId = c.Int(),
                        NivelCompetencias_NivelCompetenciaId = c.Int(),
                    })
                .PrimaryKey(t => t.descNivelId)
                .ForeignKey("CH.tab_Competencias", t => t.CompetenciaID)
                .ForeignKey("CH.cat_NivelesCompetencias", t => t.NivelCompetencias_NivelCompetenciaId)
                .Index(t => t.CompetenciaID)
                .Index(t => t.NivelCompetencias_NivelCompetenciaId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("CH.cat_DescripcionNiveles", "NivelCompetencias_NivelCompetenciaId", "CH.cat_NivelesCompetencias");
            DropForeignKey("CH.cat_DescripcionNiveles", "CompetenciaID", "CH.tab_Competencias");
            DropForeignKey("CH.cat_DescripcionComportamiento", "NivelCompetencias_NivelCompetenciaId", "CH.cat_NivelesCompetencias");
            DropForeignKey("CH.cat_DescripcionComportamiento", "CompetenciaID", "CH.tab_Competencias");
            DropForeignKey("CH.tab_Competencias", "TipoCompetenciaID", "CH.cat_TipoCompetencia");
            DropForeignKey("CH.tab_Competencias", "TipoAreaID", "CH.cat_TipoArea");
            DropForeignKey("CH.cat_CategoriasPorFamilia", "FamiliaId", "CH.tab_FamiliaPuestos");
            DropForeignKey("CH.tab_FamiliaPuestos", "TipoCompetenciaId", "CH.cat_TipoCompetencia");
            DropForeignKey("CH.tab_FamiliaPuestos", "TipoArea_TipoAreaId", "CH.cat_TipoArea");
            DropIndex("CH.cat_DescripcionNiveles", new[] { "NivelCompetencias_NivelCompetenciaId" });
            DropIndex("CH.cat_DescripcionNiveles", new[] { "CompetenciaID" });
            DropIndex("CH.cat_DescripcionComportamiento", new[] { "NivelCompetencias_NivelCompetenciaId" });
            DropIndex("CH.cat_DescripcionComportamiento", new[] { "CompetenciaID" });
            DropIndex("CH.tab_Competencias", new[] { "TipoAreaID" });
            DropIndex("CH.tab_Competencias", new[] { "TipoCompetenciaID" });
            DropIndex("CH.tab_FamiliaPuestos", new[] { "TipoArea_TipoAreaId" });
            DropIndex("CH.tab_FamiliaPuestos", new[] { "TipoCompetenciaId" });
            DropIndex("CH.cat_CategoriasPorFamilia", new[] { "FamiliaId" });
            DropTable("CH.cat_DescripcionNiveles");
            DropTable("CH.cat_NivelesCompetencias");
            DropTable("CH.cat_DescripcionComportamiento");
            DropTable("CH.tab_Competencias");
            DropTable("CH.cat_TipoCompetencia");
            DropTable("CH.cat_TipoArea");
            DropTable("CH.tab_FamiliaPuestos");
            DropTable("CH.cat_CategoriasPorFamilia");
        }
    }
}
