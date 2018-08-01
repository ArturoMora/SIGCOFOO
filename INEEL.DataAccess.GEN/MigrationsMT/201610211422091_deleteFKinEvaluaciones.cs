namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class deleteFKinEvaluaciones : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("MT.ITFEvaluaciones", "IdInformeTecnicoFinal", "MT.InformeTecnicoFinal");
            DropIndex("MT.ITFEvaluaciones", new[] { "IdInformeTecnicoFinal" });
        }
        
        public override void Down()
        {
            CreateIndex("MT.ITFEvaluaciones", "IdInformeTecnicoFinal");
            AddForeignKey("MT.ITFEvaluaciones", "IdInformeTecnicoFinal", "MT.InformeTecnicoFinal", "InformeTecnicoFinalId", cascadeDelete: true);
        }
    }
}
