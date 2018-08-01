namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CompetenciaTecnica : DbMigration
    {
        public override void Up()
        {
            AddColumn("CH.cat_CompetenciasTecnicas", "nivelId", c => c.Int(nullable: false));
            AlterColumn("CH.cat_CompetenciasTecnicas", "Competencia", c => c.String(maxLength: 200));
            AlterColumn("CH.cat_CompetenciasTecnicas", "Descripcion", c => c.String(maxLength: 200));
            CreateIndex("CH.cat_CompetenciasTecnicas", "nivelId");
            AddForeignKey("CH.cat_CompetenciasTecnicas", "nivelId", "CH.cat_NivelCompetenciaTecnica", "NivelCompetenciaId", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("CH.cat_CompetenciasTecnicas", "nivelId", "CH.cat_NivelCompetenciaTecnica");
            DropIndex("CH.cat_CompetenciasTecnicas", new[] { "nivelId" });
            AlterColumn("CH.cat_CompetenciasTecnicas", "Descripcion", c => c.String());
            AlterColumn("CH.cat_CompetenciasTecnicas", "Competencia", c => c.String());
            DropColumn("CH.cat_CompetenciasTecnicas", "nivelId");
        }
    }
}
