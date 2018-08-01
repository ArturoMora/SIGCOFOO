namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CorreccionDeUnErrorEnUnCampo : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CH.cat_ClasificacionAreas", "nivelId", "CH.cat_NivelCompetenciaTecnica");
            DropIndex("CH.cat_ClasificacionAreas", new[] { "nivelId" });
            AddColumn("CH.cat_ClasificacionAreas", "TipoAreaId", c => c.Int());
            CreateIndex("CH.cat_ClasificacionAreas", "TipoAreaId");
            AddForeignKey("CH.cat_ClasificacionAreas", "TipoAreaId", "CH.cat_TipoArea", "TipoAreaId");
            DropColumn("CH.cat_ClasificacionAreas", "nivelId");
        }
        
        public override void Down()
        {
            AddColumn("CH.cat_ClasificacionAreas", "nivelId", c => c.Int(nullable: false));
            DropForeignKey("CH.cat_ClasificacionAreas", "TipoAreaId", "CH.cat_TipoArea");
            DropIndex("CH.cat_ClasificacionAreas", new[] { "TipoAreaId" });
            DropColumn("CH.cat_ClasificacionAreas", "TipoAreaId");
            CreateIndex("CH.cat_ClasificacionAreas", "nivelId");
            AddForeignKey("CH.cat_ClasificacionAreas", "nivelId", "CH.cat_NivelCompetenciaTecnica", "NivelCompetenciaId", cascadeDelete: true);
        }
    }
}
