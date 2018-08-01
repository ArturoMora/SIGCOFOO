namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AJUSTERELACIONCOMPETENCIANIVEL : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CH.cat_RelacionNivelesComportamientoSind", "idRelacionCompetencias", "CH.cat_RelacionCompetenciasNivelSind");
            DropIndex("CH.cat_RelacionNivelesComportamientoSind", new[] { "idRelacionCompetencias" });
            AddColumn("CH.cat_RelacionCompetenciasNivelSind", "idRelacionComportamiento", c => c.Int(nullable: false));
            CreateIndex("CH.cat_RelacionCompetenciasNivelSind", "idRelacionComportamiento");
            AddForeignKey("CH.cat_RelacionCompetenciasNivelSind", "idRelacionComportamiento", "CH.cat_RelacionNivelesComportamientoSind", "id", cascadeDelete: false);
            DropColumn("CH.cat_RelacionNivelesComportamientoSind", "idRelacionCompetencias");
        }
        
        public override void Down()
        {
            AddColumn("CH.cat_RelacionNivelesComportamientoSind", "idRelacionCompetencias", c => c.Int(nullable: false));
            DropForeignKey("CH.cat_RelacionCompetenciasNivelSind", "idRelacionComportamiento", "CH.cat_RelacionNivelesComportamientoSind");
            DropIndex("CH.cat_RelacionCompetenciasNivelSind", new[] { "idRelacionComportamiento" });
            DropColumn("CH.cat_RelacionCompetenciasNivelSind", "idRelacionComportamiento");
            CreateIndex("CH.cat_RelacionNivelesComportamientoSind", "idRelacionCompetencias");
            AddForeignKey("CH.cat_RelacionNivelesComportamientoSind", "idRelacionCompetencias", "CH.cat_RelacionCompetenciasNivelSind", "id", cascadeDelete: false);
        }
    }
}
