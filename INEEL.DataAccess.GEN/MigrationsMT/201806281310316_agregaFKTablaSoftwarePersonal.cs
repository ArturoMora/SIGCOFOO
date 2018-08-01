namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class agregaFKTablaSoftwarePersonal : DbMigration
    {
        public override void Up()
        {
            AddColumn("MT.SoftwarePersonal", "DerechosAutorId", c => c.Int());
            CreateIndex("MT.SoftwarePersonal", "DerechosAutorId");
            AddForeignKey("MT.SoftwarePersonal", "DerechosAutorId", "PI.tab_DerechosAutor", "DerechosAutorId");
        }
        
        public override void Down()
        {
            DropForeignKey("MT.SoftwarePersonal", "DerechosAutorId", "PI.tab_DerechosAutor");
            DropIndex("MT.SoftwarePersonal", new[] { "DerechosAutorId" });
            DropColumn("MT.SoftwarePersonal", "DerechosAutorId");
        }
    }
}
