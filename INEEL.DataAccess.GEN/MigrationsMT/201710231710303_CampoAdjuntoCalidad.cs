namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CampoAdjuntoCalidad : DbMigration
    {
        public override void Up()
        {
            AddColumn("MT.ITFSatisfaccionCliente", "AdjuntoId", c => c.Long());
            CreateIndex("MT.ITFSatisfaccionCliente", "AdjuntoId");
            AddForeignKey("MT.ITFSatisfaccionCliente", "AdjuntoId", "GEN.Adjunto", "AdjuntoId");
        }
        
        public override void Down()
        {
            DropForeignKey("MT.ITFSatisfaccionCliente", "AdjuntoId", "GEN.Adjunto");
            DropIndex("MT.ITFSatisfaccionCliente", new[] { "AdjuntoId" });
            DropColumn("MT.ITFSatisfaccionCliente", "AdjuntoId");
        }
    }
}
