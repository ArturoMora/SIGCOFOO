namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CambiosEnTablasFamiliasPuestos : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CH.tab_FamiliaPuestos", "TipoArea_TipoAreaId", "CH.cat_TipoArea");
            DropForeignKey("CH.tab_Competencias", "TipoAreaID", "CH.cat_TipoArea");
            DropForeignKey("CH.tab_Competencias", "TipoCompetenciaID", "CH.cat_TipoCompetencia");
            DropForeignKey("CH.cat_DescripcionComportamiento", "NivelCompetencias_NivelCompetenciaId", "CH.cat_NivelesCompetencias");
            DropForeignKey("CH.cat_DescripcionNiveles", "NivelCompetencias_NivelCompetenciaId", "CH.cat_NivelesCompetencias");
            DropIndex("CH.tab_FamiliaPuestos", new[] { "TipoArea_TipoAreaId" });
            DropIndex("CH.tab_Competencias", new[] { "TipoCompetenciaID" });
            DropIndex("CH.tab_Competencias", new[] { "TipoAreaID" });
            DropIndex("CH.cat_DescripcionComportamiento", new[] { "NivelCompetencias_NivelCompetenciaId" });
            DropIndex("CH.cat_DescripcionNiveles", new[] { "NivelCompetencias_NivelCompetenciaId" });
            AddColumn("CH.tab_Competencias", "Competencia", c => c.String(maxLength: 100));
            DropColumn("CH.tab_FamiliaPuestos", "TipoNivel");
            DropColumn("CH.tab_FamiliaPuestos", "TipoArea_TipoAreaId");
            DropColumn("CH.tab_Competencias", "TipoCompetenciaID");
            DropColumn("CH.tab_Competencias", "TipoAreaID");
            DropColumn("CH.cat_DescripcionComportamiento", "NivelId");
            DropColumn("CH.cat_DescripcionComportamiento", "NivelCompetencias_NivelCompetenciaId");
            DropColumn("CH.cat_DescripcionNiveles", "nivelId");
            DropColumn("CH.cat_DescripcionNiveles", "NivelCompetencias_NivelCompetenciaId");
        }
        
        public override void Down()
        {
            AddColumn("CH.cat_DescripcionNiveles", "NivelCompetencias_NivelCompetenciaId", c => c.Int());
            AddColumn("CH.cat_DescripcionNiveles", "nivelId", c => c.Int());
            AddColumn("CH.cat_DescripcionComportamiento", "NivelCompetencias_NivelCompetenciaId", c => c.Int());
            AddColumn("CH.cat_DescripcionComportamiento", "NivelId", c => c.Int());
            AddColumn("CH.tab_Competencias", "TipoAreaID", c => c.Int());
            AddColumn("CH.tab_Competencias", "TipoCompetenciaID", c => c.Int());
            AddColumn("CH.tab_FamiliaPuestos", "TipoArea_TipoAreaId", c => c.Int());
            AddColumn("CH.tab_FamiliaPuestos", "TipoNivel", c => c.Int());
            DropColumn("CH.tab_Competencias", "Competencia");
            CreateIndex("CH.cat_DescripcionNiveles", "NivelCompetencias_NivelCompetenciaId");
            CreateIndex("CH.cat_DescripcionComportamiento", "NivelCompetencias_NivelCompetenciaId");
            CreateIndex("CH.tab_Competencias", "TipoAreaID");
            CreateIndex("CH.tab_Competencias", "TipoCompetenciaID");
            CreateIndex("CH.tab_FamiliaPuestos", "TipoArea_TipoAreaId");
            AddForeignKey("CH.cat_DescripcionNiveles", "NivelCompetencias_NivelCompetenciaId", "CH.cat_NivelesCompetencias", "NivelCompetenciaId");
            AddForeignKey("CH.cat_DescripcionComportamiento", "NivelCompetencias_NivelCompetenciaId", "CH.cat_NivelesCompetencias", "NivelCompetenciaId");
            AddForeignKey("CH.tab_Competencias", "TipoCompetenciaID", "CH.cat_TipoCompetencia", "TipoCompetenciaId");
            AddForeignKey("CH.tab_Competencias", "TipoAreaID", "CH.cat_TipoArea", "TipoAreaId");
            AddForeignKey("CH.tab_FamiliaPuestos", "TipoArea_TipoAreaId", "CH.cat_TipoArea", "TipoAreaId");
        }
    }
}
