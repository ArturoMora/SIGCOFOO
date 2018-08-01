namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class mitfAdjunto : DbMigration
    {
        public override void Up()
        {
            AddColumn("MT.InformeTecnicoFinal", "AdjuntoId", c => c.Long());
            CreateIndex("MT.InformeTecnicoFinal", "AdjuntoId");
            AddForeignKey("MT.InformeTecnicoFinal", "AdjuntoId", "GEN.Adjunto", "AdjuntoId");
        }
        
        public override void Down()
        {
            DropForeignKey("MT.InformeTecnicoFinal", "AdjuntoId", "GEN.Adjunto");
            DropIndex("MT.InformeTecnicoFinal", new[] { "AdjuntoId" });
            DropColumn("MT.InformeTecnicoFinal", "AdjuntoId");
        }
    }
}
