namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class BitacoraOportunidadNegocioCambionombre : DbMigration
    {
        public override void Up()
        {
            RenameTable(name: "CR.tBitacoraON", newName: "tab_BitacoraON");
        }
        
        public override void Down()
        {
            RenameTable(name: "CR.tab_BitacoraON", newName: "tBitacoraON");
        }
    }
}
