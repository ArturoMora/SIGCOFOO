namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class deleteFKsITF3 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("MT.ITFInsumos", "InformeTecnicoFinalId", "MT.InformeTecnicoFinal");
            DropIndex("MT.ITFInsumos", new[] { "InformeTecnicoFinalId" });
            AlterColumn("MT.ITFInsumos", "InformeTecnicoFinalId", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("MT.ITFInsumos", "InformeTecnicoFinalId", c => c.String(maxLength: 10));
            CreateIndex("MT.ITFInsumos", "InformeTecnicoFinalId");
            AddForeignKey("MT.ITFInsumos", "InformeTecnicoFinalId", "MT.InformeTecnicoFinal", "InformeTecnicoFinalId");
        }
    }
}
