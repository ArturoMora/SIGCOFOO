namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RELACIONNOMINATECNICAS : DbMigration
    {
        public override void Up()
        {
            AddColumn("CH.cat_RelacionCategoriasTecnicas", "nivelId", c => c.Int(nullable: false));
            AddColumn("CH.cat_RelacionCategoriasTecnicas", "areaId", c => c.Int(nullable: false));
            CreateIndex("CH.cat_RelacionCategoriasTecnicas", "nivelId");
            CreateIndex("CH.cat_RelacionCategoriasTecnicas", "areaId");
            AddForeignKey("CH.cat_RelacionCategoriasTecnicas", "areaId", "CH.cat_TipoArea", "TipoAreaId", cascadeDelete: true);
            AddForeignKey("CH.cat_RelacionCategoriasTecnicas", "nivelId", "CH.cat_NivelCompetenciaTecnica", "NivelCompetenciaId", cascadeDelete: true);
            DropColumn("CH.cat_RelacionCategoriasTecnicas", "nivelIdServicio");
            DropColumn("CH.cat_RelacionCategoriasTecnicas", "categoriaServicio");
            DropColumn("CH.cat_RelacionCategoriasTecnicas", "nivelIdTecnica");
            DropColumn("CH.cat_RelacionCategoriasTecnicas", "categoriaTecnica");
        }
        
        public override void Down()
        {
            AddColumn("CH.cat_RelacionCategoriasTecnicas", "categoriaTecnica", c => c.String(maxLength: 100));
            AddColumn("CH.cat_RelacionCategoriasTecnicas", "nivelIdTecnica", c => c.Int());
            AddColumn("CH.cat_RelacionCategoriasTecnicas", "categoriaServicio", c => c.String(maxLength: 100));
            AddColumn("CH.cat_RelacionCategoriasTecnicas", "nivelIdServicio", c => c.Int());
            DropForeignKey("CH.cat_RelacionCategoriasTecnicas", "nivelId", "CH.cat_NivelCompetenciaTecnica");
            DropForeignKey("CH.cat_RelacionCategoriasTecnicas", "areaId", "CH.cat_TipoArea");
            DropIndex("CH.cat_RelacionCategoriasTecnicas", new[] { "areaId" });
            DropIndex("CH.cat_RelacionCategoriasTecnicas", new[] { "nivelId" });
            DropColumn("CH.cat_RelacionCategoriasTecnicas", "areaId");
            DropColumn("CH.cat_RelacionCategoriasTecnicas", "nivelId");
        }
    }
}
