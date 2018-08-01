namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class deleteFKsITF5 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("MT.ITFInsumos", "InformeTecnicoFinalId", c => c.String(maxLength: 25));
            AlterColumn("MT.ITFEvaluaciones", "IdInformeTecnicoFinal", c => c.String(nullable: false, maxLength: 25));
            CreateIndex("MT.ITFInsumos", "InformeTecnicoFinalId");
            CreateIndex("MT.ITFEvaluaciones", "IdInformeTecnicoFinal");
            AddForeignKey("MT.ITFEvaluaciones", "IdInformeTecnicoFinal", "MT.InformeTecnicoFinal", "InformeTecnicoFinalId", cascadeDelete: true);
            AddForeignKey("MT.ITFInsumos", "InformeTecnicoFinalId", "MT.InformeTecnicoFinal", "InformeTecnicoFinalId");
        }
        
        public override void Down()
        {
            DropForeignKey("MT.ITFInsumos", "InformeTecnicoFinalId", "MT.InformeTecnicoFinal");
            DropForeignKey("MT.ITFEvaluaciones", "IdInformeTecnicoFinal", "MT.InformeTecnicoFinal");
            DropIndex("MT.ITFEvaluaciones", new[] { "IdInformeTecnicoFinal" });
            DropIndex("MT.ITFInsumos", new[] { "InformeTecnicoFinalId" });
            AlterColumn("MT.ITFEvaluaciones", "IdInformeTecnicoFinal", c => c.String());
            AlterColumn("MT.ITFInsumos", "InformeTecnicoFinalId", c => c.String());
        }
    }
}
